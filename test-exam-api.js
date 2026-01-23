/**
 * Test Script: API Exam Save Test
 * Tests the exam save functionality via API endpoint (like Admin panel does)
 * Run: node test-exam-api.js
 */

const http = require('http');
require('dotenv').config();

const API_BASE = 'http://localhost:5000/api';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTest() {
  console.log('\n🧪 ======== EXAM API SAVE TEST ========\n');

  try {
    // Step 1: Login to get JWT token
    console.log('1️⃣ Authenticating as admin...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });

    if (loginRes.status !== 200 || !loginRes.data.token) {
      console.log('❌ Login failed:', loginRes.data);
      return;
    }
    const token = loginRes.data.token;
    console.log('   ✅ Logged in successfully!\n');

    // Step 2: Get courses
    console.log('2️⃣ Getting courses...');
    const coursesRes = await makeRequest('GET', '/courses');
    if (!coursesRes.data.data || coursesRes.data.data.length === 0) {
      console.log('❌ No courses found');
      return;
    }
    const course = coursesRes.data.data[0];
    console.log(`   ✅ Found course: ${course.courseCode} - ${course.courseTitle}`);
    console.log(`   Course ID: ${course._id}\n`);

    // Step 3: Create exam with test data (mimicking Admin Panel form submission)
    console.log('3️⃣ Creating exam via API...');
    const examData = {
      courseId: course._id,
      examType: 'Midterm',
      title: 'API Test - Deep Learning Midterm Examination',
      date: '2026-02-20',
      time: {
        start: '09:30',
        end: '12:30'
      },
      location: 'Examination Hall A',
      duration: '3 hours',
      totalMarks: 80,
      format: 'Written Exam',
      syllabus: [
        'Neural Networks Fundamentals',
        'Backpropagation',
        'Convolutional Neural Networks'
      ],
      coveredLectures: [],
      guidelines: [
        'Bring student ID card',
        'Use only blue or black pen',
        'No programmable calculators'
      ],
      preparationResources: [
        { title: 'Deep Learning Textbook Ch 1-4', url: 'https://deeplearning.org/book' },
        { title: 'Practice Problems', url: 'https://example.com/practice' }
      ],
      isPublished: true
    };

    console.log('   📝 Exam data:');
    console.log(`      Type: ${examData.examType}`);
    console.log(`      Title: ${examData.title}`);
    console.log(`      Date: ${examData.date}`);
    console.log(`      Time: ${examData.time.start} - ${examData.time.end}`);
    console.log(`      Location: ${examData.location}`);
    console.log(`      Total Marks: ${examData.totalMarks}`);
    console.log('');

    const createRes = await makeRequest('POST', '/exams', examData, token);
    
    if (createRes.status === 201 && createRes.data.success) {
      console.log('   ✅ EXAM CREATED SUCCESSFULLY!');
      console.log(`      Exam ID: ${createRes.data.data._id}`);
      console.log(`      Message: ${createRes.data.message}`);

      // Step 4: Verify exam exists
      console.log('\n4️⃣ Verifying exam exists...');
      const getRes = await makeRequest('GET', `/exams/${createRes.data.data._id}`);
      if (getRes.data.success) {
        console.log('   ✅ Exam verified in database');
        console.log(`      Title: ${getRes.data.data.title}`);
      }

      // Step 5: Cleanup - delete test exam
      console.log('\n5️⃣ Cleaning up test exam...');
      const deleteRes = await makeRequest('DELETE', `/exams/${createRes.data.data._id}`, null, token);
      if (deleteRes.data.success) {
        console.log('   ✅ Test exam deleted');
      }

      console.log('\n========================================');
      console.log('🎉 ALL API TESTS PASSED!');
      console.log('========================================\n');
      console.log('The Admin Panel should now work correctly!');
      console.log('Try creating an exam at: http://localhost:3000/admin/exams\n');

    } else {
      console.log('   ❌ EXAM CREATION FAILED!');
      console.log(`      Status: ${createRes.status}`);
      console.log(`      Error: ${createRes.data.message || JSON.stringify(createRes.data)}`);
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
  }
}

runTest();
