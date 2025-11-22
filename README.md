# PitchCaller

A React application for generating softball/baseball pitch calling wristbands.

## Docker Deployment

This project includes a `Dockerfile.txt` for building a containerized version of the app.

### Build the Image

```bash
docker build -f Dockerfile.txt -t pitch-caller .
```

### Run the Container

```bash
docker run -p 3000:3000 pitch-caller
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
