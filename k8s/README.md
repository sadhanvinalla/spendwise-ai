# SpendWise Kubernetes Deployment

Build the three application images locally:

```bash
docker build -t spendwise-ai-service:latest ./ai-service
docker build -t spendwise-backend:latest ./backend
docker build -t spendwise-frontend:latest ./frontend
```

For Minikube, load the images:

```bash
minikube image load spendwise-ai-service:latest
minikube image load spendwise-backend:latest
minikube image load spendwise-frontend:latest
```

Deploy:

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods -n spendwise
kubectl get services -n spendwise
```

Open the frontend:

```bash
kubectl port-forward -n spendwise service/frontend 3000:80
```

Then open `http://localhost:3000`.
