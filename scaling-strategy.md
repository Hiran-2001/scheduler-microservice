# Scaling Strategy for Schedule Microservice

This document oulines how the scheduler microservice scales to handle ~10,000 users, ~1,000 services, and ~6,000 API requests per minute.

## 1. Horizontal Scaling
-  **Deployment**: Use Docker containers and Kubernetes to deploy multiple isntances of the microservice. A laod balancer distributes traffic across instances.
-  **Auto-Scaling**: Configure Kubernetes Horizontal Pod Autoscaler to scale pods based on CPU usage.
-  **MongoDB Sharding**: Shard the MongoDB database to distribute data across nodes, ensuring efficient storage and retrieval for ~10,000 users.

## 2. Caching and Performance Optimization
- **Redis Caching**: Cache frequent GET /jobs responses in Redis with a TTL of 1-5 minutes to reduce database load.
- **Indexing**: Create MongoDB indexes on `_id`, `nextRun`, and `status` for fast queries and updates.
- **Rate Limiting**: Use `@nestjs/throttler` to limit API requests per user, preventing abuse and ensuring fair resource allocation.

## 3. Asynchronous Processing
- **Message Queue**: Integrate a message queue (e.g., RabbitMQ or Kafka) using `@nestjs/microservices` to offload job execution. The API adds jobs to the queue, and   worker nodes process them asynchronously.
- **Worker Nodes**: Deploy separate worker services to handle job execution, keeping the API responsive for ~6,000 requests/minute.

## 4. High Availability
- **Multi-AZ Deployment**: Deploy across multiple availability zones in Kubernetes to ensure fault tolerance.
- **MongoDB Replicas**: Use MongoDB replica sets for high availability and failover.
- **Health Checks**: Configure Kubernetes liveness and readiness probes to restart unhealthy pods.

## 5. Monitoring and Optimization
- **Monitoring**: Use Prometheus and Grafana with `@nestjs/prometheus` to monitor API performance, job execution, and MongoDB metrics.
- **Optimization**: Profile and optimize job execution logic to handle increased complexity.

This strategy ensures the microservice scales efficiently, maintains performance, and provides reliability for global users and services.

## 6. Cloud Architecture for Deployment and Scaling
- **Cloud Provider Selection**: AWS is chosen for its robust ecosystem, global reach, and scalability features. Services like Elastic Kubernetes Service (EKS), Elastic Load Balancer (ALB), and Managed MongoDB (via MongoDB Atlas or DocumentDB) make it ideal for this microservice. The principles can be adapted to other providers like GCP (GKE) or Azure (AKS).

- **Architecture Overview**: 
    - **API Layer**: The NestJS microservice, containerized with Docker, running on Kubernetes (AWS EKS).
    - **Load Balancer**: AWS Application Load Balancer (ALB) to distribute traffic across microservice instances.
    - **Database Layer**: MongoDB with sharding and replica sets, hosted on MongoDB Atlas (AWS-managed) or self-hosted on EC2 with EBS for storage.
    - **Caching Layer**: AWS ElastiCache for Redis to cache API responses.
    - **Message Queue**: Amazon MQ (RabbitMQ) or AWS SQS with SNS for asynchronous job processing.
    - **Monitoring**: AWS CloudWatch, integrated with Prometheus and Grafana for metrics and logs.

- **Deployment on AWS**"
    - **Containerization**: Build a Docker image of the NestJS app (docker build -t scheduler-microservice .) and push it to AWS Elastic Container Registry (ECR).
    - **Kubernetes Cluster**: Set up an EKS cluster with multiple nodes across availability zones (e.g., us-east-1a, us-east-1b) for high availability.
    - **Service and Ingress**: Expose the microservice via a Kubernetes Service and Ingress, using an AWS ALB for load balancing.
    - **MongoDB Setup**: Use MongoDB Atlas on AWS with sharding (e.g., 3 shards) and replica sets (3 replicas per shard) for high availability and scalability.
    - **Redis Setup**: Deploy ElastiCache for Redis with a multi-AZ configuration to cache API responses.
    - **Message Queue**: Use Amazon MQ for RabbitMQ, configured with high availability (multi-AZ) to handle asynchronous job execution.

- **Cost and Optimization**"
    - **Cost Management**: Use AWS Cost Explorer to monitor usage. Optimize by:
        - Using Spot Instances for non-critical worker nodes.
        - Setting up Reserved Instances for predictable workloads (e.g., EKS nodes, MongoDB Atlas).
        - Configuring auto-scaling to minimize over-provisioning.
        
    - **Performance Optimization**: Use AWS CloudWatch to identify bottlenecks (e.g., high latency in ALB or MongoDB). Optimize by adjusting MongoDB indexes, increasing Redis cache TTL, or adding more worker nodes.

This cloud architecture ensures the microservice can scale globally, handle high traffic, and maintain reliability while optimizing costs.

**Conclusion**

This strategy, combined with the cloud architecture, ensures the scheduler microservice scales efficiently, maintains performance, and provides reliability for global users and services.