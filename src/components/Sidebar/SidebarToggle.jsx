"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const SidebarToggle = ({ isOpen, toggle }) => {
    return (
        <button
            onClick={toggle}
            className="sm:hidden fixed top-4 left-4 z-[999] bg-white p-2 rounded-md shadow-lg"
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.span
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <HiX className="w-6 h-6 text-black" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <HiMenu className="w-6 h-6 text-black" />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
};

export default SidebarToggle;
