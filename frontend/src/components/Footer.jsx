function Footer({ language }) {
    const t = {
      en: {
        rights: "© 2025 BagStorage. All rights reserved.",
      },
      lt: {
        rights: "© 2025 BagStorage. Visos teisės saugomos.",
      },
    };
  
    return (
      <footer className="footer">
        <p>{t[language].rights}</p>
      </footer>
    );
  }
  
  export default Footer;
  