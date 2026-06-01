// One-off seed: fills every strain x type page for layout/filter testing.
// 3 strains (Indica, Sativa, Hybrid) x 4 types (Flower, Pre-roll, Edibles, Vapes).
// Per page: 66 cards.
//   - Vapes:   36 Vapes + 30 Disposables
//   - Edibles: 36 Gummies + 30 Chocolate
//   - Flower / Pre-roll: 66 plain cards
// Run:  node seedGrid.js   (re-runnable; clears its own prior seed first)
// Remove this file when done.
const mongoose = require('./node_modules/mongoose');
const db = require('./config/keys').mongoURI;
const Card = require('./models/Card');

const STRAINS = ['Indica', 'Sativa', 'Hybrid'];
const MARKER = 'Seeded card for layout testing.';

// Build `count` cards for one strain/type, optionally tagging a sub-group field.
const make = (strain, type, label, count, { subField, subValue, amount } = {}) =>
    Array.from({ length: count }, (_, i) => {
        const thc = (90 - (i % 10) * 1.7).toFixed(1); // varied so THC-desc sort does something
        return {
            strain,
            type,
            ...(subField ? { [subField]: subValue } : {}),
            name: `${strain} ${label} ${i + 1}`,
            nameCross: type === 'Flower' || type === 'Pre-roll' ? `${strain} Cross ${i + 1}` : '',
            thc: String(thc),
            cbd: i % 4 === 0 ? '1.2' : '',
            cbg: '',
            cbn: '',
            description: MARKER,
            amount,
            price: String(35 + (i % 5) * 5),
            newCheckBtn: i % 9 === 0,
            recommendCheckBtn: i % 11 === 0,
            onFire: i % 13 === 0,
            onReserve: false,
        };
    });

const cards = STRAINS.flatMap((strain) => [
    // Flower / Pre-roll: 66 plain cards each
    ...make(strain, 'Flower', 'Flower', 66, { amount: '3.5g' }),
    ...make(strain, 'Pre-roll', 'Pre-roll', 66, { amount: '1g' }),
    // Edibles: 36 Gummies + 30 Chocolate
    ...make(strain, 'Edibles', 'Gummie', 36, { subField: 'edibleType', subValue: 'gummie', amount: '10pk' }),
    ...make(strain, 'Edibles', 'Chocolate', 30, { subField: 'edibleType', subValue: 'chocolate', amount: '100mg' }),
    // Vapes: 36 Vapes + 30 Disposables
    ...make(strain, 'Vapes', 'Vape', 36, { subField: 'vapeType', subValue: 'vape', amount: '1g' }),
    ...make(strain, 'Vapes', 'Disposable', 30, { subField: 'vapeType', subValue: 'disposible', amount: '2g' }),
]);

mongoose
    .connect(db)
    .then(async () => {
        const cleared = await Card.deleteMany({ description: MARKER });
        const res = await Card.insertMany(cards);
        console.log(`Cleared ${cleared.deletedCount} prior seed cards.`);
        console.log(`Inserted ${res.length} cards across ${STRAINS.length} strains x 4 types (66 each).`);
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
