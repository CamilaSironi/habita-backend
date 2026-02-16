import cors from "cors";
import express from "express";
import { DataSource } from "typeorm";
import { InquiryEntity } from "./db/entities/InquiryEntity";
import { PropertyEntity } from "./db/entities/PropertyEntity";
import { TypeormInquiryRepository } from "./repositories/typeorm/TypeormInquiryRepository";
import { TypeormPropertyRepository } from "./repositories/typeorm/TypeormPropertyRepository";
import { PropertyService } from "./services/PropertyService";
import { InquiryService } from "./services/InquiryService";
import { PropertyController } from "./controllers/PropertyController";
import { InquiryController } from "./controllers/InquiryController";
import { createPropertyRoutes } from "./routes/propertyRoutes";
import { healthRoutes } from "./routes/healthRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp(dataSource: DataSource) {
	const propertyRepository = new TypeormPropertyRepository(dataSource.getRepository(PropertyEntity));
	const inquiryRepository = new TypeormInquiryRepository(dataSource.getRepository(InquiryEntity));

	const propertyService = new PropertyService(propertyRepository);
	const inquiryService = new InquiryService(inquiryRepository, propertyRepository);

	const propertyController = new PropertyController(propertyService);
	const inquiryController = new InquiryController(inquiryService);

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use("/api", healthRoutes);
	app.use("/api", createPropertyRoutes(propertyController, inquiryController));

	app.use(errorHandler);

	return app;
}
