import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const authorization = headersList.get('authorization');

  // Возвращаем настоящий пароль
  if (authorization !== `Bearer MySuperSecretCronPassword12345!`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!adminDb) {
    return NextResponse.json({ error: 'Firestore is not initialized.' }, { status: 500 });
  }

  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('balance', '>', 0).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: 'No users with a positive balance to update.' });
    }

    const batch = adminDb.batch();
    let updatedUsersCount = 0;

    snapshot.forEach(doc => {
      const userData = doc.data();
      const currentBalance = userData.balance;
      const weeklyReward = currentBalance * 0.10; // 10%
      
      const userDocRef = usersRef.doc(doc.id);
      batch.update(userDocRef, { balance: FieldValue.increment(weeklyReward) });
      
      updatedUsersCount++;
    });

    await batch.commit();
    
    return NextResponse.json({ success: true, message: `Successfully applied staking rewards to ${updatedUsersCount} users.` });

  } catch (error: any) {
    console.error('Error applying staking rewards:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}