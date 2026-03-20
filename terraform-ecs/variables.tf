variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the ECS application"
  type        = string
  default     = "affordable-ecs-app"
}
