# Setting Nginx to serve the static files
FROM nginx:alpine

# Copy the build output to Nginx's public directory
COPY dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]