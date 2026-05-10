# Aradhi — CI/CD Pipeline (AWS)

## Architecture

```
PR / push
   │
   ▼
[CICD Workflow]
   ├── Job 1: Lint (flake8) + Tests (pytest)
   ├── Job 2: Build frontend (Vite) → artifact
   └── Job 3: Build Docker → push vers Amazon ECR
   │
   │  (seulement sur main)
   ▼
[Deploy Workflow]
   ├── Backend  → Amazon ECS Fargate
   └── Frontend → Amazon S3 + CloudFront
```

## Services AWS utilisés

| Rôle | Service AWS | Coût estimé/mois |
|---|---|---|
| Docker Registry | **Amazon ECR** | ~$0.10 |
| Backend FastAPI | **ECS Fargate** | ~$5-10 |
| Frontend React | **S3 + CloudFront** | ~$0.50 |
| **Total** | | **~$6-11/mois** |

Avec $100 de crédits → **9 à 16 mois** de déploiement.

---

## GitHub Secrets à configurer

Aller dans **Settings → Secrets and variables → Actions** :

| Secret | Comment l'obtenir |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS Console → IAM → Users → ton user → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | Même endroit (visible seulement à la création) |
| `S3_BUCKET_NAME` | Nom du bucket créé à l'étape 4 |
| `CLOUDFRONT_DISTRIBUTION_ID` | AWS Console → CloudFront → ta distribution |

---

## Setup AWS (une seule fois)

### Étape 1 — Créer un utilisateur IAM pour GitHub Actions

```bash
# Créer l'utilisateur
aws iam create-user --user-name github-actions-aradhi

# Attacher les permissions nécessaires
aws iam attach-user-policy \
  --user-name github-actions-aradhi \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

aws iam attach-user-policy \
  --user-name github-actions-aradhi \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

aws iam attach-user-policy \
  --user-name github-actions-aradhi \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-user-policy \
  --user-name github-actions-aradhi \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

# Créer les clés d'accès → copier dans GitHub Secrets
aws iam create-access-key --user-name github-actions-aradhi
```

### Étape 2 — Créer le repository ECR

```bash
aws ecr create-repository \
  --repository-name aradhi-backend \
  --region us-east-1
```

### Étape 3 — Créer le cluster et service ECS Fargate

```bash
# Cluster
aws ecs create-cluster --cluster-name aradhi-cluster

# Log group pour les logs du container
aws logs create-log-group --log-group-name /ecs/aradhi-backend

# Enregistrer la task definition (remplacer <AWS_ACCOUNT_ID>)
aws ecs register-task-definition \
  --family aradhi-backend \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 512 \
  --memory 1024 \
  --execution-role-arn arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole \
  --container-definitions file://aws/task-definition-template.json

# Créer le service
aws ecs create-service \
  --cluster aradhi-cluster \
  --service-name aradhi-backend-service \
  --task-definition aradhi-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<SUBNET_ID>],securityGroups=[<SG_ID>],assignPublicIp=ENABLED}"
```

### Étape 4 — Créer le bucket S3 + CloudFront pour le frontend

```bash
# Créer le bucket S3
aws s3 mb s3://aradhi-frontend --region us-east-1

# Activer le hosting statique
aws s3 website s3://aradhi-frontend \
  --index-document index.html \
  --error-document index.html

# Créer la distribution CloudFront
aws cloudfront create-distribution \
  --origin-domain-name aradhi-frontend.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

---

## Développement local

```bash
make test           # Run pytest dans Docker
make lint           # Flake8 sur backend + tests
make run-api        # FastAPI avec hot reload
make run-frontend   # Vite dev server
make shell          # Shell dans le conteneur dev
make lock           # Régénérer poetry.lock
make push           # Build & push image vers ECR
make deploy-backend # Force redeploy ECS
make deploy-frontend # Deploy frontend vers S3
```
