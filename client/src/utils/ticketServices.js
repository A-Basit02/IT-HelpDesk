// // client/src/services/ticketServices.js
// import axiosInstance from "./axiosInstance";

// // ===== EXPORT ALL TICKETS (Admin only) =====
// export const exportAllTickets = async () => {
//   try {
//     const response = await axiosInstance.get("/tickets/export/all", {
//       responseType: "blob", // file download
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "all_tickets.xlsx");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error("Error exporting all tickets:", error);
//     throw error;
//   }
// };

// // ===== EXPORT MY TICKETS (User only) =====
// export const exportMyTickets = async () => {
//   try {
//     const response = await axiosInstance.get("/tickets/export/my", {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "my_tickets.xlsx");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error("Error exporting my tickets:", error);
//     throw error;
//   }
// };

// // ===== IMPORT TICKETS (Admin only) =====
// export const importTickets = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axiosInstance.post("/tickets/import", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error importing tickets:", error);
//     throw error;
//   }
// };

// ticketServices.js
import axiosInstance from "./axiosInstance"; // adjust path if needed

async function downloadBlobResponse(response, filename) {
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const exportAllTickets = async (params = {}) => {
  const res = await axiosInstance.get("/tickets/export/all", {
    params,
    responseType: "blob", // important for binaries
  });
  const fileName = `tickets_all_${new Date().toISOString().slice(0,10)}.xlsx`;
  await downloadBlobResponse(res, fileName);
};

export const exportMyTickets = async (params = {}) => {
  const res = await axiosInstance.get("/tickets/export/my", {
    params,
    responseType: "blob",
  });
  const fileName = `tickets_my_${new Date().toISOString().slice(0,10)}.xlsx`;
  await downloadBlobResponse(res, fileName);
};

// fallback default (optional)
export default {
  exportAllTickets,
  exportMyTickets,
};

