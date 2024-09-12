module.exports = {
  apps: [
    {
      name: "Agroveda",
      script: "./dist/index.js", // Ensure this points to the correct file
      instances: 1, // Set to a specific number or 'max' for all CPU cores
      exec_mode: "cluster", // Use 'fork' if you don't need clustering
      watch: false, // Set to true if you want PM2 to watch for file changes
      env: {
        NODE_ENV: "production",
      },
      // Optional: Customize logs and other settings if needed
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      autorestart: true,
    },
  ],
};
