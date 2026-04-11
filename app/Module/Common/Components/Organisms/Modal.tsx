"use client";

import { motion, AnimatePresence } from "framer-motion";
import ModalHeader from "../Molecules/ModalHeader";
import ModalFooter from "../Molecules/ModalFooter";

type Props = {
  open: boolean;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  icon: string;
  title: string;
  description: string;
  variant?: "error" | "warning" | "info";
  onClose?: () => void;
};

export default function Modal({
  open,
  className = "",
  children,
  footer,
  icon,
  title,
  description,
  variant = "info",
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2c2a51]/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* MODAL CARD */}
          <motion.div
            className={`
              max-w-md w-full bg-surface-container-lowest 
              rounded-[2rem] overflow-hidden
              shadow-[0_24px_48px_-12px_rgba(44,42,81,0.15)]
              ring-1 ring-outline-variant/10
              ${className}
            `}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <ModalHeader
              icon={icon}
              title={title}
              description={description}
              variant={variant}
            />

            {/* CONTENT */}
            {children && (
              <div className="px-8 pb-6">{children}</div>
            )}

            {/* FOOTER */}
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}