import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// This is the function that will be executed by the cron job.
export async function GET(request: NextRequest) {
  // 1. Authenticate the request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  // 2. Get all users from Firestore
  if (!adminDb) {
    return NextResponse.json({ error: 'Firestore is not initialized.' }, { status: 500 });
  }

  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('No users found to update.');
      return NextResponse.json({ message: 'No users to update.' });
    }

    // 3. Create a batch to update all users at once
    const batch = adminDb.batch();
    let updatedUsersCount = 0;

    snapshot.forEach(doc => {
      const userData = doc.data();
      const currentBalance = userData.balance || 0;

      // Only give rewards to users with a positive balance
      if (currentBalance > 0) {
        const weeklyReward = currentBalance * 0.10; // Calculate 10% weekly reward
        
        const userDocRef = usersRef.doc(doc.id);
        batch.update(userDocRef, { balance: FieldValue.increment(weeklyReward) });
        
        updatedUsersCount++;
      }
    });

    // 4. Commit the batch
    await batch.commit();
    
    console.log(`Successfully applied staking rewards to ${updatedUsersCount} users.`);
    return NextResponse.json({ message: `Staking rewards applied to ${updatedUsersCount} users.` });

  } catch (error: any) {
    console.error('Error applying staking rewards:', error.message);
    return NextResponse.json({ error: 'Failed to apply staking rewards', details: error.message }, { status: 500 });
  }
}