import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=${itemsPerPage}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des entreprises');
      }
      
      const data = await response.json();
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Re-trigger search with new page
    handleSearch(new Event('submit'));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
    // Re-trigger search with new settings
    handleSearch(new Event('submit'));
  };

  const openCompanyModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Recherche d'Entreprises</h1>
      </header>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une entreprise..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Rechercher
          </button>
        </div>
      </form>

      <div className="pagination-options">
        <label>
          Résultats par page:
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            className="items-per-page"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {loading && <div className="loading">Chargement des résultats...</div>}
      
      {error && <div className="error">Erreur: {error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="no-results">Aucun résultat trouvé</div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="results-container">
          <h2>Résultats</h2>
          <ul className="results-list">
            {results.map((company) => (
              <li 
                key={company.siren} 
                className="company-card"
                onClick={() => openCompanyModal(company)}
              >
                <h3>{company.nom_complet || company.nom_raison_sociale}</h3>
                {company.siren && <p><strong>SIREN:</strong> {company.siren}</p>}
                {company.siret && <p><strong>SIRET:</strong> {company.siret}</p>}
                {company.activite_principale && <p><strong>Activité:</strong> {company.activite_principale}</p>}
                {company.siege?.libelle_commune && <p><strong>Commune:</strong> {company.siege.libelle_commune}</p>}
                {company.siege?.code_postal && <p><strong>Code Postal:</strong> {company.siege.code_postal}</p>}
              </li>
            ))}
          </ul>

          {totalResults > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Précédent
              </button>
              <span className="page-info">
                Page {currentPage} sur {Math.ceil(totalResults / itemsPerPage)}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalResults / itemsPerPage)}
                className="pagination-button"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedCompany && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>{selectedCompany.nom_complet || selectedCompany.nom_raison_sociale}</h2>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Informations générales</h3>
                {selectedCompany.siren && <p><strong>SIREN:</strong> {selectedCompany.siren}</p>}
                {selectedCompany.siret && <p><strong>SIRET:</strong> {selectedCompany.siret}</p>}
                {selectedCompany.date_creation && <p><strong>Date de création:</strong> {new Date(selectedCompany.date_creation).toLocaleDateString('fr-FR')}</p>}
                {selectedCompany.tranche_effectif && <p><strong>Effectif:</strong> {selectedCompany.tranche_effectif}</p>}
                {selectedCompany.categorie_entreprise && <p><strong>Catégorie d'entreprise:</strong> {selectedCompany.categorie_entreprise}</p>}
              </div>

              <div className="modal-section">
                <h3>Activité</h3>
                {selectedCompany.activite_principale && <p><strong>Activité principale:</strong> {selectedCompany.activite_principale}</p>}
                {selectedCompany.libelle_activite_principale && <p><strong>Libellé:</strong> {selectedCompany.libelle_activite_principale}</p>}
                {selectedCompany.etat_administratif && <p><strong>État administratif:</strong> {selectedCompany.etat_administratif}</p>}
              </div>

              {selectedCompany.siege && (
                <div className="modal-section">
                  <h3>Adresse du siège</h3>
                  {selectedCompany.siege.adresse && <p><strong>Adresse:</strong> {selectedCompany.siege.adresse}</p>}
                  {selectedCompany.siege.code_postal && <p><strong>Code postal:</strong> {selectedCompany.siege.code_postal}</p>}
                  {selectedCompany.siege.libelle_commune && <p><strong>Commune:</strong> {selectedCompany.siege.libelle_commune}</p>}
                  {selectedCompany.siege.code_departement && <p><strong>Département:</strong> {selectedCompany.siege.code_departement}</p>}
                  {selectedCompany.siege.libelle_departement && <p><strong>Libellé département:</strong> {selectedCompany.siege.libelle_departement}</p>}
                </div>
              )}

              {selectedCompany.dirigeants && selectedCompany.dirigeants.length > 0 && (
                <div className="modal-section">
                  <h3>Dirigeants</h3>
                  {selectedCompany.dirigeants.map((dirigeant, index) => (
                    <div key={index} className="dirigeant-item">
                      <p><strong>Nom:</strong> {dirigeant.nom || 'Non renseigné'}</p>
                      <p><strong>Prénom:</strong> {dirigeant.prenom || 'Non renseigné'}</p>
                      <p><strong>Fonction:</strong> {dirigeant.fonction || 'Non renseigné'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
