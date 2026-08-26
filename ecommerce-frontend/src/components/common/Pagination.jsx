function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '2rem 0' }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                }}
            >
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        style={{
                            background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                            border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                            color: '#fff',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontWeight: isActive ? 'bold' : 'normal'
                        }}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                }}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;