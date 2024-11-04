const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="15 12 85 32" className="w-24">
      {/* Seierid */}
      <path d="M40 40 L40 15 M40 40 L55 40" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round"
            fill="none"/>
            
      {/* Veerandring punktiirjoonega */}
      <path d="M40 15 A25 25 0 0 1 65 40" 
            stroke="currentColor" 
            strokeWidth="0.5"
            strokeDasharray="0.5,4"
            fill="none"/>
            
      {/* Täpid kellaringil */}
      <circle cx="52.5" cy="18.4" r="1.2" fill="currentColor"/>
      <circle cx="61.6" cy="27.5" r="1.2" fill="currentColor"/>
      
      {/* Tekst */}
      <text x="59" y="41" 
            fontFamily="Arial" 
            fontSize="20" 
            fontWeight="300"
            fill="currentColor"
            letterSpacing="1">ıble</text>
    </svg>
  );
};

export default Logo;
