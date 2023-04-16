Steps to install services and dependices in EKS Cluster

1. Install Kafka 
````
helm install vidshare bitnami/kafka
````
2. Install MongoDB
````
helm install vidshare-db -f vidshare-mongodb-values.yaml bitnami/mongodb
````
``set env variable as password``
````
export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default vidshare-db-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 -d)
echo $MONGODB_ROOT_PASSWORD                  
````
3. Install uplaodvideos serivce
````
helm install vidshare-uploadvideos ./vidshare-uploadvideos
````
4. Install searchvideos service
````
helm install vidshare-searchvideos ./vidshare-searchvideos
````