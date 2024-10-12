export const searchProfessionService = async (db, query) => {
  try {
    // Приведення запиту до нижнього регістру
    const normalizedQuery = query.toLowerCase();

    console.log("QUERY: ", normalizedQuery);

    // SQL-запит, що використовує LOWER для поля name і code_kp
    const searchQuery = `
      SELECT id, code_kp, name
      FROM professions
      WHERE LOWER(code_kp) LIKE ?
      OR LOWER(name) LIKE ?
    `;

    // Пошук для будь-яких збігів з використанням LIKE та %
    const results = db
      .prepare(searchQuery)
      .all(`%${normalizedQuery}%`, `%${normalizedQuery}%`);

    // Форматування результатів
    const formattedResults = results.map((row) => ({
      id: row.id,
      code_kp: row.code_kp,
      name: row.name,
    }));

    return formattedResults;
  } catch (error) {
    console.error("Failed to search professions", error);
    throw new Error("Failed to search professions");
  }
};

// Вагар
// Вагар-обліковець
// Вагар-обліковець
// Вагар
// Контролер-вагар
// Насипальник-вагар (спеціальні хімічні виробництва)
// Насипальник-вагар (спеціальні хімічні виробництва)
// Контролер-вагар
