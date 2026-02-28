import * as Dialog from "@radix-ui/react-dialog";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50" />
        <Dialog.Content
          className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm rounded-2xl p-5 glass-elevated"
          aria-label={title}
        >
          <Dialog.Title className="text-base font-semibold" style={{ color: "var(--text-1)" }}>
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm mt-2" style={{ color: "var(--text-2)" }}>
            {description}
          </Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="btn btn-secondary py-2 px-3 text-sm rounded-lg focus-ring">
                {cancelText}
              </button>
            </Dialog.Close>
            <button className="btn btn-danger py-2 px-3 text-sm rounded-lg focus-ring" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
