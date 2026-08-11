┌──────────────┐
│     USER     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ password     │
│ role         │
└──────┬───────┘
       │
       │ 1:1
       ↓
┌──────────────┐
│   PROVIDER   │
├──────────────┤
│ id           │
│ userId       │
│ profileImage │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│   LISTING    │
├──────────────┤
│ id           │
│ providerId   │
│ title        │
│ description  │
│ category     │
│ location     │
│ image        │
│ price        │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│     SLOT     │
├──────────────┤
│ id           │
│ listingId    │
│ startTime    │
│ endTime      │
└──────┬───────┘
       │
       │ 1:1
       ↓
┌──────────────┐
│   BOOKING    │
├──────────────┤
│ id           │
│ customerId   │
│ slotId       │
│ status       │
└──────┬───────┘
       │
       │ 1:1
       ↓
┌──────────────┐
│    REVIEW    │
├──────────────┤
│ id           │
│ bookingId    │
│ customerId   │
│ listingId    │
│ rating       │
│ comment      │
└──────────────┘