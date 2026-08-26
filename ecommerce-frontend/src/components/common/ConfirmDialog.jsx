import Modal from './Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed with this action?' }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                    Cancel
                </button>
                <button onClick={() => { onConfirm(); onClose(); }} style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                    Confirm
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;