const xlsx = require('xlsx');

const data = [
    { Nom: "Dr. Ahmed Youssef", Spécialité: "Cardiologue", Téléphone: "06 11 22 33 44", Adresse: "15 Avenue Hassan II", Ville: "El Jadida" },
    { Nom: "Dr. Fatima Zahra", Spécialité: "Pédiatre", Téléphone: "06 99 88 77 66", Adresse: "Résidence la Plage", Ville: "El Jadida" },
    { Nom: "Dr. Yassine Oualid", Spécialité: "Généraliste", Téléphone: "06 55 44 33 22", Adresse: "Hay Salam, Rue 4", Ville: "El Jadida" },
    { Nom: "Dr. Sara Bennani", Spécialité: "Dermatologue", Téléphone: "06 77 66 55 44", Adresse: "Centre Ville", Ville: "El Jadida" },
    { Nom: "Dr. Karim Tazi", Spécialité: "Ophtalmologue", Téléphone: "06 12 34 56 78", Adresse: "Boulevard Zerktouni", Ville: "Casablanca" }
];

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Docteurs");
xlsx.writeFile(wb, "public/doctors.xlsx");
console.log("Mock excel file created successfully in public/doctors.xlsx");
