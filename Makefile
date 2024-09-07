# Help command: Lists all available commands with descriptions
help:
	@echo "Available commands:"
	@echo "  make install        - Install all dependencies for the server and client"
	@echo "  make build-client   - Build the React app (client)"
	@echo "  make start-client   - Start the React development server"
	@echo "  make start-server   - Start the Node.js server"
	@echo "  make dev-server     - Start the Node.js server in development mode (nodemon)"
	@echo "  make dev            - Start both the React client and Node.js server in development mode"
	@echo "  make clean          - Clean the client build directory"
	@echo "  make test           - Run the placeholder test script"

# Install dependencies
install:
	@npm install && cd client && npm install

# Build the React client
build:
	@npm run build

# Start the Node.js server in development mode with nodemon
dev:
	@make build && npm run dev

# Start the React client
react:
	@cd client && npm run start

# Clean build artifacts
clean:
	@npm run clean

# Default target (build the client)
all: build-client

deploy:
	@make build && vercel --prod