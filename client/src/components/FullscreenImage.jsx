import React, { useState } from "react";
import { Box, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// const FullscreenImage = ({ src }) => {
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <>
//       {/* Thumbnail or clickable image */}
//       <img
//         src={src}
//         alt="Ticket Attachment"
//         className="w-64 h-auto rounded shadow cursor-pointer"
//         onClick={handleOpen}
//       />

//       {/* Fullscreen Modal */}
//       <Fade in={open}>
//         <Box
//           onClick={handleClose} // Click outside closes
//           sx={{
//             display: open ? "flex" : "none",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             bgcolor: "rgba(0,0,0,0.8)",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999,
//           }}
//         >
//           <Box
//             sx={{
//               position: "relative",
//               maxWidth: "90%",
//               maxHeight: "90%",
//             }}
//             onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
//           >
//             <img
//               src={src}
//               alt="Full Attachment"
//               style={{
//                 width: "100%",
//                 height: "auto",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//               }}
//             />
//             {/* Close Button */}
//             <IconButton
//               onClick={handleClose}
//               sx={{
//                 position: "absolute",
//                 top: 16,
//                 right: 16,
//                 color: "white",
//                 bgcolor: "rgba(0,0,0,0.6)",
//                 "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       </Fade>
//     </>
//   );
// };

// export default FullscreenImage;
const FullscreenImage = ({ src, thumbnail = true }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Thumbnail */}
      <img
        src={src}
        alt="Ticket Attachment"
        onClick={handleOpen}
        style={{
          width: thumbnail ? "100%" : "auto",
          maxHeight: thumbnail ? "250px" : "auto",
          objectFit: thumbnail ? "contain" : "unset",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      />

      {/* Fullscreen Modal */}
      <Fade in={open}>
        <Box
          onClick={handleClose}
          sx={{
            display: open ? "flex" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt="Full Attachment"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            />
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                bgcolor: "rgba(0,0,0,0.6)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default FullscreenImage;
