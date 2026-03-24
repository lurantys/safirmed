const xlsx = require('xlsx');

const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106399.04344400593!2d-8.599182379207038!3d33.24151743155702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda91dff3fd2fbb1%3A0xe10ee8e30b6e9df5!2sEl%20Jadida!5e0!3m2!1sen!2sma!4v1709405626987!5m2!1sen!2sma";

const data = [
    { ID: "doc-1", Nom: "Dr. Ahmed Youssef", Spécialité: "Cardiologue", Téléphone: "06 11 22 33 44", Adresse: "15 Avenue Hassan II", Ville: "El Jadida", Horaire: "Lundi - Vendredi: 09h00 - 17h00", MapEmbed: mapUrl },
    { ID: "doc-2", Nom: "Dr. Fatima Zahra", Spécialité: "Pédiatre", Téléphone: "06 99 88 77 66", Adresse: "Résidence la Plage", Ville: "El Jadida", Horaire: "Lundi - Samedi: 08h30 - 15h00", MapEmbed: mapUrl },
    { ID: "doc-3", Nom: "Dr. Yassine Oualid", Spécialité: "Généraliste", Téléphone: "06 55 44 33 22", Adresse: "Hay Salam, Rue 4", Ville: "El Jadida", Horaire: "Lundi - Vendredi: 10h00 - 18h00", MapEmbed: mapUrl },
    { ID: "doc-4", Nom: "Dr. Sara Bennani", Spécialité: "Dermatologue", Téléphone: "06 77 66 55 44", Adresse: "Centre Ville", Ville: "El Jadida", Horaire: "Lundi - Jeudi: 09h30 - 16h30", MapEmbed: mapUrl },
    { ID: "doc-5", Nom: "Dr. Karim Tazi", Spécialité: "Ophtalmologue", Téléphone: "06 12 34 56 78", Adresse: "Boulevard Zerktouni", Ville: "Casablanca", Horaire: "Lundi - Vendredi: 09h00 - 12h00, 14h00 - 18h00", MapEmbed: mapUrl }
];

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Docteurs");
xlsx.writeFile(wb, "public/doctors.xlsx");
console.log("Mock excel file updated with ID, Horaire, and MapEmbed!");
