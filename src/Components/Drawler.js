// import React, {Fragment, useEffect, useState} from "react";
// import {
//     Drawer,
//     Button,
//     Typography,
//     IconButton,
//     List,
// } from "@material-tailwind/react";
// import 'flatpickr/dist/flatpickr.min.css';
// import FilterSearch from "./FilterSearch";
// import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";
//
// export function Drawler() {
//     const [open, setOpen] = useState(false);
//     const openDrawer = () => setOpen(true);
//     const closeDrawer = () => setOpen(false);
//
//     const scrollDisable = () => {
//         document.body.style.overflow = 'hidden';
//     }
//     useEffect(() => {
//         if (open) {
//             scrollDisable();
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//     }, [open]);
//
//
//     return (
//         <Fragment>
//             <Button variant={"outlined"} color={"indigo"} onClick={openDrawer} className="px-3 py-2.5">
//                 <AdjustmentsHorizontalIcon className="h-5 w-5"/>
//             </Button>
//             <Drawer open={open} onClose={closeDrawer}  outsidePress={false}>
//                 <div className="mb-2 flex items-center justify-between p-4">
//                     <Typography variant="h5" color="blue-gray">
//                         Material Tailwind
//                     </Typography>
//                     <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth={2}
//                             stroke="currentColor"
//                             className="h-5 w-5"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M6 18L18 6M6 6l12 12"
//                             />
//                         </svg>
//                     </IconButton>
//                 </div>
//                 <List>
//                     <FilterSearch/>
//                 </List>
//             </Drawer>
//         </Fragment>
//     );
// }