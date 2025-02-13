### Running the App with Docker

1.  **Build the Docker image**
	In the project directory, run:
	```bash
	docker build -t <my-app> .
	```
	  Replace \<my-app> with a name of your choice for the image.

2. **Run the Docker container**
	Once the image is built, run the container with:
	```
	docker run -d -p 3000:3000 <my-app>
	```
	This will map port 3000 inside the container to port 3000 on your local machine.

  

3. **Access the App**
	Using Postman, your browser, or other app, send requests to http://localhost:3000.