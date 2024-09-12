// module.exports = {
//   apps: [
//     {
//       name: "Agroveda-Backend",
//       script:
//         "/home/milan/runners/backend/actions-runner/_work/Backend/Backend/dist", // /home/milan/runners/backend/actions-runner/_work/Backend/Backend
//       watch: false,
//     },
//   ],
// };
module.exports = {
  apps: [
    {
      name: "Agroveda",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
