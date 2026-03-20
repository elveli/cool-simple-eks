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

## 3. Cleanup (Avoid unexpected charges)

When you are done experimenting, destroy the resources to stop incurring costs:

```bash
cd terraform-ecs
terraform destroy -auto-approve
```
