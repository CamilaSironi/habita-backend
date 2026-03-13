import cors from "cors";
import express from "express";
import { DataSource } from "typeorm";
import { FavoritesEntity } from "./db/entities/FavoritesEntity";
import { InquiryEntity } from "./db/entities/InquiryEntity";
import { PropertyEntity } from "./db/entities/PropertyEntity";
import { PropertyImageEntity } from "./db/entities/PropertyImageEntity";
import { UserEntity } from "./db/entities/UserEntity";
import { TypeormFavoritesRepository } from "./repositories/typeorm/TypeormFavoritesRepository";
import { TypeormInquiryRepository } from "./repositories/typeorm/TypeormInquiryRepository";
import { TypeormPropertyRepository } from "./repositories/typeorm/TypeormPropertyRepository";
import { TypeormPropertyImageRepository } from "./repositories/typeorm/TypeormPropertyImageRepository";
import { TypeormUserRepository } from "./repositories/typeorm/TypeormUserRepository";
import { FavoritesService } from "./services/FavoritesService";
import { InquiryService } from "./services/InquiryService";
import { PropertyImageService } from "./services/PropertyImageService";
import { PropertyService } from "./services/PropertyService";
import { UserService } from "./services/UserService";
import { FavoritesController } from "./controllers/FavoritesController";
import { InquiryController } from "./controllers/InquiryController";
import { PropertyController } from "./controllers/PropertyController";
import { PropertyImageController } from "./controllers/PropertyImageController";
import { UserController } from "./controllers/UserController";
import { createFavoritesRoutes } from "./routes/favoritesRoutes";
import { createInquiryRoutes } from "./routes/inquiryRoutes";
import { createPropertyRoutes } from "./routes/propertyRoutes";
import { createPropertyImageRoutes } from "./routes/propertyImageRoutes";
import { createUserRoutes } from "./routes/userRoutes";
import { healthRoutes } from "./routes/healthRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp(dataSource: DataSource) {
	const favoritesRepository = new TypeormFavoritesRepository(dataSource.getRepository(FavoritesEntity));
	const inquiryRepository = new TypeormInquiryRepository(dataSource.getRepository(InquiryEntity));
	const propertyRepository = new TypeormPropertyRepository(dataSource.getRepository(PropertyEntity));
	const propertyImageRepository = new TypeormPropertyImageRepository(dataSource.getRepository(PropertyImageEntity));
	const userRepository = new TypeormUserRepository(dataSource.getRepository(UserEntity));

	const favoritesService = new FavoritesService(favoritesRepository);
	const inquiryService = new InquiryService(inquiryRepository, propertyRepository);
	const propertyService = new PropertyService(propertyRepository);
	const propertyImageService = new PropertyImageService(propertyImageRepository);
	const userService = new UserService(userRepository);

	const favoritesController = new FavoritesController(favoritesService);
	const inquiryController = new InquiryController(inquiryService);
	const propertyController = new PropertyController(propertyService);
	const propertyImageController = new PropertyImageController(propertyImageService);
	const userController = new UserController(userService);

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use("/api", healthRoutes);
	app.use("/api", createPropertyRoutes(propertyController));
	app.use("/api", createInquiryRoutes(inquiryController));
	app.use("/api", createFavoritesRoutes(favoritesController));
	app.use("/api", createUserRoutes(userController));
	app.use("/api", createPropertyImageRoutes(propertyImageController));

	app.use(errorHandler);

	return app;
}
