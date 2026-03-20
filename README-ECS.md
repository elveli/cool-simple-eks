# Serverless ECS Fargate Project

This is a completely separate application and infrastructure setup from the EKS project. It provisions an affordable AWS ECS cluster using **Fargate Spot** capacity, an Application Load Balancer (ALB), and deploys a new React application.

## Infrastructure Details
- **VPC**: A new VPC with public and private subnets across 2 Availability Zones.
- **NAT Gateway**: A single NAT gateway to reduce costs.
- **ECS Cluster**: Serverless container management.
- **Compute**: Uses **Fargate Spot** capacity providers to run containers at up to a 70% discount compared to standard Fargate, with zero EC2 instances to manage.
- **ALB**: Application Load Balancer to route traffic to the ECS tasks.

## Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/downloads) installed.
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured.

## 1. Provision the Infrastructure

Navigate to the `terraform-ecs` directory and apply the configuration:

```bash
cd terraform-ecs
terraform init
terraform plan
terraform apply -auto-approve
```

*(Note: The `main.tf` currently uses an `nginx:alpine` image for simplicity. To deploy the custom React app, build the `Dockerfile` inside the `ecs-app` directory, push it to Amazon ECR, and update the `image` field in `terraform-ecs/main.tf`.)*

## 2. Access the App

Once Terraform completes, it will output the DNS name of the Application Load Balancer.

```bash
terraform output alb_dns_name
```
Copy the URL and open it in your browser. Note that it may take a few minutes for the ECS tasks to start and register with the Load Balancer.

## 3. Managing the ECS Environment (kubectl / helm equivalents)

**Important Note:** Because ECS is an AWS-native container orchestration service and *not* Kubernetes (EKS), tools like `kubectl` and `helm` **do not work here**. Instead, you use the **AWS CLI** (`aws ecs`) to probe, check, and scale your environment.

Here are the AWS CLI equivalents to common `kubectl` commands for managing your ECS cluster:

### Check Cluster Status (like `kubectl cluster-info`)
```bash
aws ecs describe-clusters --clusters affordable-ecs-app-cluster
```

### List Running Tasks/Pods (like `kubectl get pods`)
```bash
aws ecs list-tasks --cluster affordable-ecs-app-cluster
```

### Check Service Status (like `kubectl get deployments / svc`)
```bash
aws ecs describe-services \
  --cluster affordable-ecs-app-cluster \
  --services affordable-ecs-app-service
```

### Scale the Application (like `kubectl scale deployment`)
To scale your application up to 4 tasks (replicas), run:
```bash
aws ecs update-service \
  --cluster affordable-ecs-app-cluster \
  --service affordable-ecs-app-service \
  --desired-count 4
```

### View Application Logs (like `kubectl logs`)
Since we configured the `awslogs` driver in Terraform, your container logs are sent to CloudWatch. You can view them using the AWS CLI v2:
```bash
aws logs tail /ecs/affordable-ecs-app --follow
```

## 4. Cleanup (Avoid unexpected charges)

When you are done experimenting, destroy the resources to stop incurring costs:

```bash
cd terraform-ecs
terraform destroy -auto-approve
```
