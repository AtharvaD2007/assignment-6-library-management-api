const { db } = require('../config/firebaseConfig');

const getBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let booksRef = db.collection('books');
    
    // Note: Firestore doesn't support full-text search natively without extensions (like Algolia).
    // For simple equality, we can use category. For 'search' by title, we will fetch and filter in memory for this assignment,
    // though in production it's better to use a dedicated search service.
    if (category) {
      booksRef = booksRef.where('category', '==', category);
    }

    const snapshot = await booksRef.get();
    let books = [];
    snapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() });
    });

    if (search) {
      const lowerSearch = search.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(lowerSearch));
    }

    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const doc = await db.collection('books').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBook = async (req, res) => {
  const { title, author, isbn, category, totalCopies } = req.body;
  
  if (!title || !author || !isbn || !totalCopies) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const newBook = {
      title,
      author,
      isbn,
      category: category || 'Uncategorized',
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('books').add(newBook);
    res.status(201).json({ success: true, data: { id: docRef.id, ...newBook } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookRef = db.collection('books').doc(req.params.id);
    const doc = await bookRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const updates = req.body;
    
    // If updating totalCopies, adjust availableCopies as well
    if (updates.totalCopies) {
      const currentData = doc.data();
      const diff = parseInt(updates.totalCopies) - currentData.totalCopies;
      updates.totalCopies = parseInt(updates.totalCopies);
      updates.availableCopies = currentData.availableCopies + diff;
      
      if (updates.availableCopies < 0) {
        return res.status(400).json({ success: false, message: 'Invalid copy adjustment. availableCopies cannot be less than 0' });
      }
    }

    await bookRef.update(updates);
    res.status(200).json({ success: true, message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookRef = db.collection('books').doc(req.params.id);
    const doc = await bookRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    await bookRef.delete();
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
