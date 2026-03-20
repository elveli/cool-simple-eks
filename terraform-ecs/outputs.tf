output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = module.alb.dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.this.name
}

output "region" {
  description = "AWS region"
  value       = var.region
}
