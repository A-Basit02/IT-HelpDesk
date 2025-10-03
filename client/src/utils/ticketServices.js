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

