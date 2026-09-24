const { db, admin } = require('../config/firebaseConfig');

const borrowBook = async (req, res) => {
  const { id } = req.params; // bookId
  const userId = req.user.uid;

  try {
    // Run a transaction to ensure atomicity
    const result = await db.runTransaction(async (t) => {
      const bookRef = db.collection('books').doc(id);
      const bookDoc = await t.get(bookRef);

      if (!bookDoc.exists) {
        throw new Error('Book not found');
      }

      const book = bookDoc.data();
      if (book.availableCopies <= 0) {
        throw new Error('No copies available to borrow');
      }

      // Check if user has already borrowed this book and hasn't returned it
      const borrowRecordsRef = db.collection('borrow_records');
      const activeBorrows = await borrowRecordsRef
        .where('userId', '==', userId)
        .where('bookId', '==', id)
        .where('status', '==', 'borrowed')
        .get();

      if (!activeBorrows.empty) {
        throw new Error('You have already borrowed this book');
      }

      // Decrement copies
      t.update(bookRef, {
        availableCopies: admin.firestore.FieldValue.increment(-1)
      });

      // Create borrow record
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days borrow period

      const newBorrowRecord = {
        userId,
        bookId: id,
        bookTitle: book.title,
        borrowDate: borrowDate.toISOString(),
        dueDate: dueDate.toISOString(),
        returnDate: null,
        status: 'borrowed'
      };

      const newRecordRef = borrowRecordsRef.doc();
      t.set(newRecordRef, newBorrowRecord);

      return { id: newRecordRef.id, ...newBorrowRecord };
    });

    res.status(200).json({ success: true, message: 'Book borrowed successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const returnBook = async (req, res) => {
  const { id } = req.params; // bookId
  const userId = req.user.uid;

  try {
    const result = await db.runTransaction(async (t) => {
      // Find active borrow record
      const borrowRecordsRef = db.collection('borrow_records');
      const activeBorrows = await borrowRecordsRef
        .where('userId', '==', userId)
        .where('bookId', '==', id)
        .where('status', '==', 'borrowed')
        .get();

      if (activeBorrows.empty) {
        throw new Error('No active borrow record found for this book');
      }

      const recordDoc = activeBorrows.docs[0];
      
      const bookRef = db.collection('books').doc(id);
      
      // Update record to returned
      t.update(recordDoc.ref, {
        status: 'returned',
        returnDate: new Date().toISOString()
      });

      // Increment copies
      t.update(bookRef, {
        availableCopies: admin.firestore.FieldValue.increment(1)
      });

      return { recordId: recordDoc.id };
    });

    res.status(200).json({ success: true, message: 'Book returned successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyHistory = async (req, res) => {
  const userId = req.user.uid;
  try {
    const snapshot = await db.collection('borrow_records').where('userId', '==', userId).get();
    const records = [];
    snapshot.forEach(doc => records.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBorrowRecords = async (req, res) => {
  try {
    const snapshot = await db.collection('borrow_records').get();
    const records = [];
    snapshot.forEach(doc => records.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { borrowBook, returnBook, getMyHistory, getAllBorrowRecords };
