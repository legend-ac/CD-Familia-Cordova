import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  getDocs, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  ClubState, 
  WeeklyMember, 
  SundayWeek, 
  PolladaItem, 
  JalePlayer, 
  Commitment, 
  FamilyMemory 
} from '../types';
import { buildInitialState } from '../data/initialData';

const MEMBERS_COL = 'members';
const WEEKS_COL = 'weeks';
const POLLADAS_COL = 'polladas';
const JALES_COL = 'jales';
const COMMITMENTS_COL = 'commitments';
const MEMORIES_COL = 'memories';
const CHEERS_COL = 'cheers';

/**
 * Initializes and seeds Firestore with initial realistic baseline data if collections are empty.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const membersSnap = await getDocs(collection(db, MEMBERS_COL));
    if (!membersSnap.empty) {
      return; // Already seeded
    }

    const initial = buildInitialState();
    const batch = writeBatch(db);

    // 1. Seed Members
    initial.members.forEach(m => {
      const ref = doc(db, MEMBERS_COL, m.id);
      batch.set(ref, m);
    });

    // 2. Seed Weeks (first 33 weeks)
    initial.weeks.forEach(w => {
      const ref = doc(db, WEEKS_COL, `w_${w.weekNumber}`);
      batch.set(ref, w);
    });

    // 3. Seed Polladas
    initial.polladas.forEach(p => {
      const ref = doc(db, POLLADAS_COL, p.id);
      batch.set(ref, p);
    });

    // 4. Seed Jales
    initial.jales.forEach(j => {
      const ref = doc(db, JALES_COL, j.id);
      batch.set(ref, j);
    });

    // 5. Seed Commitments
    initial.commitments.forEach(c => {
      const ref = doc(db, COMMITMENTS_COL, c.id);
      batch.set(ref, c);
    });

    // 6. Seed Memories
    initial.memories.forEach(m => {
      const ref = doc(db, MEMORIES_COL, m.id);
      batch.set(ref, m);
    });

    await batch.commit();
    console.log('Firebase Firestore seeded successfully with CD Familia Córdova 2027 data!');
  } catch (error) {
    console.warn('Seeding note:', error);
  }
}

/**
 * Real-time subscriber to all collections in Firestore.
 * Triggers callback whenever any family member updates a payment, pollada or commitment.
 */
export function subscribeToLiveClub(
  onUpdate: (updater: (prev: ClubState) => ClubState) => void,
  onError?: (err: any) => void
) {
  const unsubscribers: (() => void)[] = [];

  // 1. Members Listener
  unsubscribers.push(
    onSnapshot(collection(db, MEMBERS_COL), (snap) => {
      if (snap.empty) return;
      const members: WeeklyMember[] = [];
      snap.forEach(d => members.push(d.data() as WeeklyMember));
      onUpdate(prev => ({
        ...prev,
        members: members.length > 0 ? members : prev.members
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, MEMBERS_COL);
    })
  );

  // 2. Weeks Listener
  unsubscribers.push(
    onSnapshot(collection(db, WEEKS_COL), (snap) => {
      if (snap.empty) return;
      const weeks: SundayWeek[] = [];
      snap.forEach(d => weeks.push(d.data() as SundayWeek));
      weeks.sort((a, b) => a.weekNumber - b.weekNumber);
      onUpdate(prev => ({
        ...prev,
        weeks: weeks.length > 0 ? weeks : prev.weeks
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, WEEKS_COL);
    })
  );

  // 3. Polladas Listener
  unsubscribers.push(
    onSnapshot(collection(db, POLLADAS_COL), (snap) => {
      if (snap.empty) return;
      const polladas: PolladaItem[] = [];
      snap.forEach(d => polladas.push(d.data() as PolladaItem));
      polladas.sort((a, b) => a.number - b.number);
      onUpdate(prev => ({
        ...prev,
        polladas: polladas.length > 0 ? polladas : prev.polladas
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, POLLADAS_COL);
    })
  );

  // 4. Jales Listener
  unsubscribers.push(
    onSnapshot(collection(db, JALES_COL), (snap) => {
      if (snap.empty) return;
      const jales: JalePlayer[] = [];
      snap.forEach(d => jales.push(d.data() as JalePlayer));
      jales.sort((a, b) => a.number - b.number);
      onUpdate(prev => ({
        ...prev,
        jales: jales.length > 0 ? jales : prev.jales
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, JALES_COL);
    })
  );

  // 5. Commitments Listener
  unsubscribers.push(
    onSnapshot(collection(db, COMMITMENTS_COL), (snap) => {
      if (snap.empty) return;
      const commitments: Commitment[] = [];
      snap.forEach(d => commitments.push(d.data() as Commitment));
      onUpdate(prev => ({
        ...prev,
        commitments: commitments.length > 0 ? commitments : prev.commitments
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, COMMITMENTS_COL);
    })
  );

  // 6. Memories Listener
  unsubscribers.push(
    onSnapshot(collection(db, MEMORIES_COL), (snap) => {
      if (snap.empty) return;
      const memories: FamilyMemory[] = [];
      snap.forEach(d => memories.push(d.data() as FamilyMemory));
      onUpdate(prev => ({
        ...prev,
        memories: memories.length > 0 ? memories : prev.memories
      }));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, MEMORIES_COL);
    })
  );

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}

/**
 * Mutation: Save Sunday payment for a member
 */
export async function updateWeeklyPaymentInFirebase(weekNumber: number, memberId: string, paid: boolean, method = 'Efectivo'): Promise<void> {
  const path = `${WEEKS_COL}/w_${weekNumber}`;
  try {
    const weekRef = doc(db, WEEKS_COL, `w_${weekNumber}`);
    await setDoc(weekRef, {
      weekNumber,
      payments: {
        [memberId]: {
          paid,
          amount: 10,
          paidAt: paid ? new Date().toISOString() : null,
          method: paid ? method : null
        }
      }
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Mutation: Mark whole week paid in Firebase
 */
export async function markEntireWeekInFirebase(weekNumber: number, members: WeeklyMember[]): Promise<void> {
  const path = `${WEEKS_COL}/w_${weekNumber}`;
  try {
    const weekRef = doc(db, WEEKS_COL, `w_${weekNumber}`);
    const payments: Record<string, any> = {};
    members.filter(m => m.active).forEach(m => {
      payments[m.id] = {
        paid: true,
        amount: 10,
        paidAt: new Date().toISOString(),
        method: 'Efectivo'
      };
    });

    await setDoc(weekRef, {
      weekNumber,
      payments
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Mutation: Add a new member in Firebase
 */
export async function addMemberInFirebase(member: WeeklyMember): Promise<void> {
  const path = `${MEMBERS_COL}/${member.id}`;
  try {
    await setDoc(doc(db, MEMBERS_COL, member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Mutation: Update Pollada
 */
export async function updatePolladaInFirebase(pollada: PolladaItem): Promise<void> {
  const path = `${POLLADAS_COL}/${pollada.id}`;
  try {
    await setDoc(doc(db, POLLADAS_COL, pollada.id), pollada, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Mutation: Update Jale
 */
export async function updateJaleInFirebase(jale: JalePlayer): Promise<void> {
  const path = `${JALES_COL}/${jale.id}`;
  try {
    await setDoc(doc(db, JALES_COL, jale.id), jale, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Mutation: Update Commitment
 */
export async function updateCommitmentInFirebase(commitmentId: string, status: string): Promise<void> {
  const path = `${COMMITMENTS_COL}/${commitmentId}`;
  try {
    await updateDoc(doc(db, COMMITMENTS_COL, commitmentId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Mutation: Add new commitment
 */
export async function addCommitmentInFirebase(commitment: Commitment): Promise<void> {
  const path = `${COMMITMENTS_COL}/${commitment.id}`;
  try {
    await setDoc(doc(db, COMMITMENTS_COL, commitment.id), commitment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Mutation: Add new memory
 */
export async function addMemoryInFirebase(memory: FamilyMemory): Promise<void> {
  const path = `${MEMORIES_COL}/${memory.id}`;
  try {
    await setDoc(doc(db, MEMORIES_COL, memory.id), memory);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
