# Examen

## Prérequis

On commence par récupérer le fichier kubeconfig.yml, ensuite dans un terminal bash :

```SH
export KUBECONFIG=<absolute-path-to>/kubeconfig.yml
```
Créez votre namespace personnel :
```SH
kubectl create namespace "votre-namespace"
```
Remplacez "votre-namespace" par un nom unique qui vous identifie.

- Pour vérifier que votre configuration est correcte, utilisez la commande suivante qui affiche la configuration actuelle de kubectl : `kubectl config view`
- Pour vérifier la connectivité : `kubectl get nodes`

- Pour changer le context on utilise : `kubectl config set-context --current --namespace=riadkolli`
- N'oublier pas d'installer les dépendances avec : `yarn`



# Le projet

### RabbitMQ

Comme spécifié dans <a href="https://github.com/arthurescriou/k8s-exercice-eda" >l'exercice </a> précédent, déployez RabbitMQ sur le cluster.

#### Intstallation
```SH
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
```
On récupere le fichier `rabbitmq.yml` et on le place dans notre projet.

Utilisez la commande suivante pour appliquer : `kubectl apply -f rabbitmq.yml`

Avec la commande : `kubectl get pods` :

```
NAME                                  READY   STATUS    RESTARTS   AGE   
production-rabbitmqcluster-server-0   1/1     Running   0          5h55m     
production-rabbitmqcluster-server-1   1/1     Running   0          5h55m     
production-rabbitmqcluster-server-2   1/1     Running   0          5h55m
```
### PostgreSQL

Dans le dossier `database` on a créé les deux fichier `postgres-deployment.yml` et `postgres-service.yml`.

Utilisez les commandes suivantes :
```bash
kubectl apply -f postgres-deployment.yml

kubectl apply -f postgres-service.yml
```
```
NAME                                  READY   STATUS    RESTARTS   AGE 
postgres-7ffbd7c8f6-2rtsf             1/1     Running   0          4h41m     
production-rabbitmqcluster-server-0   1/1     Running   0          5h55m     
production-rabbitmqcluster-server-1   1/1     Running   0          5h55m     
production-rabbitmqcluster-server-2   1/1     Running   0          5h55m 
```

Puis vérifier les services

```
NAME                               TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                          AGE

postgres                           ClusterIP      10.3.197.106   <none>           5432/TCP                                         5h10m
production-rabbitmqcluster         LoadBalancer   10.3.198.35    162.19.110.149   15692:32678/TCP,5672:32676/TCP,15672:30888/TCP   5h59m
production-rabbitmqcluster-nodes   ClusterIP      None           <none>           4369/TCP,25672/TCP                               5h59m
```
Pour lister tous les services dans votre cluster Kubernetes : `kubectl get services`

Pour afficher les journaux d’un pod spécifique faire : `kubectl logs "id du pod"
`

Pour récuperer l'id du pod spécifique en utilisant la commande `kubectl get pods` qui liste tous les pods dans votre cluster Kubernetes.



### Serveur

Fourni dans le dossier `backend`.

On a créer un déploiement pour lancer un pod de serveur en suivant les instructions.

On a créer le fichier `server-deployment.yml` qu'on execute avec `kubectl apply -f server-deployment.yml`

Pour afficher le pod spécifique : `kubectl get pods`

```
NAME                                  READY   STATUS    RESTARTS   AGE
nodejs-server-56dcb76577-8mtll        1/1     Running   0          80m
postgres-7ffbd7c8f6-2rtsf             1/1     Running   0          4h52m
production-rabbitmqcluster-server-0   1/1     Running   0          6h6m
production-rabbitmqcluster-server-1   1/1     Running   0          6h6m
production-rabbitmqcluster-server-2   1/1     Running   0          6h6m
```
- Et quand on execute le pod du serveur : `kubectl logs nodejs-server-56dcb76577-8mtll` :
```
yarn run v1.22.19
$ caravel migrate
🎆  Connected to DB.
👌 Migration table exists
📈 Getting all migrations in table...
📄 Getting all migrations from folder...
🙌 Database is up to date!
🤝 Migrations finished successfully !
Done in 0.24s.
yarn run v1.22.19
$ ts-node src/main
[2024-05-24T13:33:09.698Z](at Object):  {
  user: 'myuser',
  host: 'postgres',
  database: 'mydatabase',
  port: '5432',
  password: 'mypassword'
}
[2024-05-24T13:33:09.881Z](at listenRabbit):  trying to connect to  amqp://162.19.110.149:5672
[2024-05-24T13:33:09.885Z](at origin):  undefined
--> Routes:  {
  PATCH: [ '/count/delete' ],
  NOT_FOUND: [ '/' ]
}
Postgres: Connection success
[2024-05-24T13:33:09.945Z](at listenRabbit):  connected to  amqp://162.19.110.149:5672
```


Et si on veut supprimer : `kubectl delete -f server-deployment.yml`
#### Images docker

Pour utiliser des images docker dans nos fichier Yml, on a créé des Dockerfile, et on executer la commande : `docker build -t nom-de-votre-image .`,
Puis on fait `docker push nom-de-votre-image`

Une fois le serveur fonctionnel on a ajoutez un autoscaler pour qu'il suive la charge.

L'autoscaler placer dans la racine du projet `autoscaler.yml`, qu'on fait executer avec `kubectl apply -f autoscaler.yml`

```bash
curl 162.19.110.47:4040/count/create -X POST
```

### Tester l'application

On a à notre disposition un script: `count.js` dans le dossier du serveur.

On a créer un Dockerfile.count, puis on fait ces commandes :
```
docker build -t riko99/counter -f ./Dockerfile.count .

docker push riko99/counter
```

On a créer un fichier `count-deployment.yaml`, qu'on execute avec : `kubectl apply -f count-deployment.yaml`

# Fin