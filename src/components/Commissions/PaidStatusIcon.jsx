"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const iconVariants = {
    unchecked: { rotate: 0, scale: 1 },
    checked: { rotate: 360, scale: 1.2 },
};

const PaidStatusIcon = ({ status, onClick }) => {
    return (
        <motion.button
            onClick={onClick}

            className={`mx-auto w-8 h-8 rounded-full cursor-pointer ${status ? "border-green-500" : "border-gray-400"
                } flex items-center justify-center transition-colors duration-300`}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Bezahlt"
        >
            <motion.div
                variants={iconVariants}
                animate={status ? "checked" : "unchecked"}
                transition={{ duration: 0.4 }}
                className={`text-sm ${status ? "text-green-500" : "text-gray-500"}`}
            >
                {status ? <Check size={18} /> : <X size={18} />}
            </motion.div>
        </motion.button>
    );
};

export default PaidStatusIcon;
