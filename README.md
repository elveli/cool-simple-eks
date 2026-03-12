# Affordable EKS Cluster & Cool App Deployment

This project contains Terraform code to provision an affordable Amazon EKS cluster using Spot instances, and Kubernetes manifests to deploy a simple web application.

## Infrastructure Details
- **VPC**: A new VPC with public and private subnets across 2 Availability Zones.
- **NAT Gateway**: A single NAT gateway to reduce costs.
- **EKS Cluster**: Managed Kubernetes cluster.
- **Node Group**: Uses EC2 **Spot Instances** (`t3.small`, `t3.medium`) to keep costs extremely low.

## Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/downloads) installed.
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured with your credentials.
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed.

## 1. Provision the Infrastructure

Navigate to the `terraform` directory and apply the configuration:

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

## 2. Connect to the EKS Cluster

Once Terraform completes, configure `kubectl` to connect to your new cluster:

```bash
aws eks --region $(terraform output -raw region) update-kubeconfig --name $(terraform output -raw cluster_name)
```

Verify you can see the Spot nodes:
```bash
kubectl get nodes
```

## 3. Deploy the Cool App

You can deploy the application using either plain Kubernetes manifests or **Helm** (the package manager for Kubernetes). Helm is recommended as it makes managing, configuring, and upgrading your applications much easier.

### Option A: Deploy using Helm (Recommended)

Helm packages Kubernetes resources into a single logical deployment called a "Chart". It allows you to template your configurations and easily override them using a `values.yaml` file.

1. Ensure you have [Helm](https://helm.sh/docs/intro/install/) installed.
2. Navigate to the `helm` directory and install the chart:

```bash
cd ../helm
# helm install <release-name> <chart-directory>
helm install my-cool-app ./cool-app
```

**Why use Helm?**
- **Templating**: Instead of hardcoding values (like replicas or image tags), Helm uses variables defined in `values.yaml`.
- **Easy Upgrades**: If you want to change the number of replicas to 5, you can simply run: `helm upgrade my-cool-app ./cool-app --set replicaCount=5`.
- **Clean Rollbacks**: If an upgrade fails, you can easily revert to a previous state using `helm rollback my-cool-app`.
- **Unified Management**: `helm uninstall` cleanly removes all associated resources (Deployments, Services, ConfigMaps, etc.) at once.

### Option B: Deploy using plain kubectl

If you prefer not to use Helm, you can apply the raw manifests:

```bash
cd ../k8s
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

*(Note: Both methods currently use an `nginx:alpine` image for simplicity. You can build the included `Dockerfile` to containerize the React app in this repository, push it to Docker Hub or Amazon ECR, and update the `image` field in `values.yaml` or `deployment.yaml` to deploy your custom app.)*

### Deployment Details
- **Deployment**: Creates 2 replicas of the app to ensure high availability across your Spot nodes.
- **Service**: Creates an AWS Classic Load Balancer (or NLB depending on AWS defaults) to expose the app to the internet.
- **Resources**: CPU and Memory requests/limits are configured to ensure the app schedules well on small instances.

## 4. Access the App

Get the external IP/URL of the Load Balancer:

```bash
# If you used Helm:
kubectl get svc my-cool-app-cool-app-service

# If you used plain kubectl:
kubectl get svc cool-app-service
```
Copy the `EXTERNAL-IP` value and open it in your browser. Note that it may take a few minutes for the AWS Load Balancer to provision and become active.

## 5. Cleanup (Avoid unexpected charges)

When you are done experimenting, destroy the resources to stop incurring costs:

```bash
# 1. Delete Kubernetes resources (important to delete the Load Balancer first so AWS cleans it up)
# If you used Helm:
helm uninstall my-cool-app

# If you used plain kubectl:
kubectl delete -f ../k8s/service.yaml
kubectl delete -f ../k8s/deployment.yaml

# 2. Destroy Terraform infrastructure
cd ../terraform
terraform destroy -auto-approve
```

[![Hits](https://hits.sh/github.com/elveli/repository.svg)](https://hits.sh/github.com/elveli/repository/)
