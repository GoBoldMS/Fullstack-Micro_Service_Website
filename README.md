#     Fullstack Micro Service Website

This is a ticketing website built using Node.js and TypeScript for the backend and React for the client-side. The website provides the following services:

- Auth: handles user authentication using JWT tokens.
- Tickets: handles the creation and updating of tickets.
- Orders: handles the creation, updating, and cancellation of orders for a given ticket.
- Payments: handles charging for orders using Stripe API.
- Expiration: handles the expiration of orders when they time out.
- Client: handles the client-side of the application.
- Common: a common npm library shared between the backend and client-side.

The project also includes a `deployment` folder containing Kubernetes YAML files for deploying the application to a Kubernetes cluster.

## Technologies Used

- Backend: Node.js, TypeScript, Express, MongoDB, Mongoose
- Client: React, TypeScript, Next.js
- Skaffold: Debug ENV
- Containerization: Docker
- Deployment: Kubernetes
- Payments: Stripe

## Getting Started

### Prerequisites

To run this project, you will need to have the following software installed on your local machine:

- Node.js (v12 or later)
- Docker
- Kubernetes (optional)
- Stripe account

### Installation

1. Clone this repository to your local machine.
git clone https://github.com/GoBoldMS/ticketing.git

2. Create a secret env variables for:

STRIPE_KEY=your_stripe_secret_key
JWT_KEY=your_jwt_secret_key

Replace the values with your own configuration.

3. Install NGINX Ingress Controller on your k8s cluster 

https://kubernetes.github.io/ingress-nginx/deploy/

4. Navigate to the `client` directory and create another `.env` file with the following environment variables:
NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key

Replace the value with your own Stripe public key.
cd client
touch .env
echo 'NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key' >> .env

5. Navigate back to the root directory and run `npm install` to install the project's dependencies.
cd ..
npm install

### Deployment

In order that this project will work you have to a deploy it to a Kubernetes cluster:

1. Ensure that your Kubernetes cluster is running and accessible.
2. Navigate to the `infra` folder.
3. Run `kubectl apply -f .` to create the necessary deployments and services.

### Debug
I recommend to use Skaffold in order to debug the project on you local env
Just install Skaffold and then from the root folder run `Skaffold dev` to start the project. 


### Usage

Once the development server is running or the project is deployed, you can access the website by navigating to `https://ticketing.dev` in your web browser.
(you will need to create a dedacted host for it)

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
