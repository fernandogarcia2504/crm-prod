import Business from "../models/business.model.js"

export const createBusiness = async (req, res) => {
    try{

        const {name, description, type, gophishUrl} = req.body;

        if(!name || !description) {
            return res.status(400).json({
                message: "Nombre y descripcion son requeridos"
            })
        }

        const existingBusiness = await Business.findOne({ name })

        if (existingBusiness) {
            return res.status(409).json({
                message: "La empresa ya existe"
            })
        }

        const business = await Business.create({
            name,
            description,
            type,
            gophishUrl
        });

        return res.status(201).json({
            message: "Empresa creada correctamente",
            business
        });

    } catch(error){

        console.error(error)

        return res.status(500).json({message: "Error al crear la empresa"})
    }
}

export const getBusinesses = async (req, res) => {
    try {

        const businesses = await Business.find();

        return res.status(200).json({
            businesses
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las empresas"
        });
    }
};


export const getBusiness = async (req, res) => {
    try {

        const { id } = req.params;

        const business = await Business.findById(id);

        if (!business) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        return res.status(200).json({
            business
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la empresa"
        });
    }
};


export const updateBusiness = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description, active, type, gophishUrl } = req.body;

        const business = await Business.findById(id);

        if (!business) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        if (name) {
            const existingBusiness = await Business.findOne({
                name,
                _id: { $ne: id }
            });

            if (existingBusiness) {
                return res.status(409).json({
                    message: "Ya existe una empresa con ese nombre"
                });
            }

            business.name = name;
        }

        if (description) {
            business.description = description;
        }

        if (active !== undefined) {
            business.active = active;
        }

        if (type !== undefined) {
            business.type = type;
        }

        if (gophishUrl !== undefined) {
            business.gophishUrl = gophishUrl;
        }

        await business.save();

        return res.status(200).json({
            message: "Empresa actualizada correctamente",
            business
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar la empresa"
        });
    }
};


export const deleteBusiness = async (req, res) => {
    try {

        const { id } = req.params;

        const business = await Business.findById(id);

        if (!business) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        await Business.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Empresa eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar la empresa"
        });
    }
};
