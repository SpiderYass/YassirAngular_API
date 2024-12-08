const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Import the plugin

const assignmentSchema = new mongoose.Schema({
    id: Number,
    nom: String,
    dateDeRendu: Date,
    rendu: Boolean
});

// Add the plugin to the schema
assignmentSchema.plugin(aggregatePaginate);

const Assignment = mongoose.model('Assignment', assignmentSchema);

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res) {
    let assignmentId = req.params.id;

    try {
        let assignment = await Assignment.findOne({ id: assignmentId });
        res.json(assignment);
    } catch (err) {
        res.send(err);
    }
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment);

    try {
        await assignment.save();
        res.json({ message: `${assignment.nom} saved!` });
    } catch (err) {
        res.send('cant post assignment ', err);
    }
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);

    try {
        await Assignment.findOneAndUpdate({ id: req.body.id }, req.body, { new: true });
        res.json({ message: 'updated' });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

// suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    try {
        let assignment = await Assignment.findOneAndRemove({ id: req.params.id });
        res.json({ message: `${assignment.nom} deleted` });
    } catch (err) {
        res.send(err);
    }
}

// Bulk insertion of assignments (POST)
async function bulkInsertAssignments(req, res) {
    try {
        await Assignment.insertMany(req.body);
        res.json({ message: 'Bulk insert successful' });
    } catch (err) {
        res.send(err);
    }
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, bulkInsertAssignments };