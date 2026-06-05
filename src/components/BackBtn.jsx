// Chevron back button.
export function BackBtn({ dark, onClick }) {
  const c = dark ? '#e8e6e3' : '#1a1a1a';
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', padding: '4px 2px' }}>
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
        <path
          d="M9 1L1.5 8.5 9 16"
          stroke={c}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
