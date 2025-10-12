import { Request } from "express";
import { prisma } from "../../../utils/prisma";
import QueryBuilder from "../../../utils/queryBuilder";
import {
	exampleFilterFields,
	exampleInclude,
	exampleNestedFilters,
	exampleRangeFilter,
	exampleSearchFields,
} from "./example.constant";
import config from "../../../config";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../error/ApiErrors";
import { Prisma } from "@prisma/client";


const createExample = async (req: Request) => {
	const payload = req.body;

	const example = await prisma.example.create({ data: payload });

	return example;
};

const getExamples = async (req: Request) => {
	const queryBuilder = new QueryBuilder(req.query, prisma.example);
	const results = await queryBuilder
		.filter(exampleFilterFields)
		.search(exampleSearchFields)
		.nestedFilter(exampleNestedFilters)
		.sort()
		.paginate()
		.include(exampleInclude)
		.fields()
		.filterByRange(exampleRangeFilter)
		.execute();

	const meta = await queryBuilder.countTotal();
	return { data: results, meta };
};

const getExampleById = async (id: string) => {
	return prisma.example.findUnique({ where: { id } });
};

const updateExample = async (req: Request) => {
	const { id } = req.params;
	const data= req.body;
	const user = req.user;
	const role = user?.role;

	const whereClause: Prisma.ExampleWhereUniqueInput = {
		id,
		...(role === "-----" ? { userId: user.id } : {}),
	};

	const existing = await prisma.example.findUnique({ where: whereClause });
	if (!existing) {
		throw new ApiError(StatusCodes.NOT_FOUND, `Example not found with this id: ${id}`);
	}

	return prisma.example.update({
		where: whereClause,
		data: {
			...data,
		},
	});
};

const deleteExample = async (req: Request) => {
	await prisma.example.delete({ where: { id: req.params.id } });
};

export const ExampleServices = {
	getExamples,
	getExampleById,
	updateExample,
	deleteExample,
	createExample
};