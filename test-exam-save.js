/**
 * Test Script: Save Exam with Dummy Values
 * Run: node test-exam-save.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Exam = require('./server/models/Exam');
const Course = require('./server/models/Course');

const MONGODB_URI = process.env.MONGODB_URI;

async function testExamSave() {
  console.log('\n🧪 ======== EXAM SAVE TEST ========\n');
  
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    // First, get an existing course
    const course = await Course.findOne();
    if (!course) {
      console.log('❌ No course found in database. Please create a course first.');
      await mongoose.connection.close();
      return;
    }
    console.log(`📚 Using Course: ${course.courseCode} - ${course.courseTitle}`);
    console.log(`   Course ID: ${course._id}\n`);

    // Define test exam data with dummy values (matching frontend format)
    const testExamData = {
      courseId: course._id,
      examType: 'Midterm',
      title: 'Test Midterm Examination - Deep Learning Fundamentals',
      date: '2026-02-15', // String format as sent from frontend
      time: {
        start: '09:00',
        end: '12:00'
      },
      location: 'Room A-101, Main Building',
      duration: '3 hours',
      totalMarks: 100,
      format: 'Written + Practical',
      syllabus: [
        'Neural Network Basics',
        'Backpropagation Algorithm',
        'Activation Functions',
        'Loss Functions and Optimization'
      ],
      coveredLectures: [], // Empty for test
      guidelines: [
        'Bring your student ID',
        'No electronic devices allowed',
        'Answer all questions',
        'Time management is crucial'
      ],
      preparationResources: [
        { title: 'Deep Learning Book - Chapter 1-5', url: 'https://www.deeplearningbook.org/', resourceType: 'document' },
        { title: 'Practice Problems Set', url: 'https://example.com/practice', resourceType: 'link' }
      ],
      isPublished: true
    };

    console.log('📝 Test Exam Data:');
    console.log('   Type:', testExamData.examType);
    console.log('   Title:', testExamData.title);
    console.log('   Date:', testExamData.date);
    console.log('   Time:', testExamData.time.start, '-', testExamData.time.end);
    console.log('   Location:', testExamData.location);
    console.log('   Duration:', testExamData.duration);
    console.log('   Total Marks:', testExamData.totalMarks);
    console.log('   Syllabus Topics:', testExamData.syllabus.length);
    console.log('   Guidelines:', testExamData.guidelines.length);
    console.log('   Resources:', testExamData.preparationResources.length);
    console.log('');

    // Create and save exam
    console.log('💾 Saving exam to database...');
    const exam = new Exam(testExamData);
    const savedExam = await exam.save();
    
    console.log('\n✅ EXAM SAVED SUCCESSFULLY!');
    console.log('   Exam ID:', savedExam._id);
    console.log('   Created At:', savedExam.createdAt);
    
    // Verify by reading back
    console.log('\n🔍 Verifying saved exam...');
    const verifiedExam = await Exam.findById(savedExam._id);
    if (verifiedExam) {
      console.log('✅ Exam verified in database');
      console.log('   Title:', verifiedExam.title);
      console.log('   Total Marks:', verifiedExam.totalMarks);
    }

    // Optionally delete test exam
    console.log('\n🧹 Cleaning up test exam...');
    await Exam.findByIdAndDelete(savedExam._id);
    console.log('✅ Test exam deleted');

    console.log('\n========================================');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('\n📋 Validation Errors:');
      Object.keys(error.errors).forEach(field => {
        console.error(`   - ${field}: ${error.errors[field].message}`);
      });
    }
    
    if (error.stack) {
      console.error('\nStack Trace:');
      console.error(error.stack);
    }
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testExamSave();
