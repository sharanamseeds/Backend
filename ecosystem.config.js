module.exports = {
  apps: [
    {
      name: "Agroveda",
      script: "./dist/index.js", // Ensure this points to the correct file
      instances: "max", // Use 'max' to utilize all CPU cores or set a specific number
      exec_mode: "cluster",
      watch: false, // Set to true if you want to watch for file changes
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
