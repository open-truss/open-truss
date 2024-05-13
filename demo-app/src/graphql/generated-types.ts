import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: BigInt; output: BigInt; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
};

export type ArchiveStoredQueryInput = {
  databaseId: Scalars['BigInt']['input'];
};

export type CreateStoredQueryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expireAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
  source: Scalars['String']['input'];
};

export type HelloInput = {
  name: Scalars['String']['input'];
};

export type HelloResponse = {
  __typename?: 'HelloResponse';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  archiveStoredQuery: StoredQuery;
  createStoredQuery: StoredQuery;
  hello: HelloResponse;
  updateStoredQuery: StoredQuery;
};


export type MutationArchiveStoredQueryArgs = {
  input: ArchiveStoredQueryInput;
};


export type MutationCreateStoredQueryArgs = {
  input: CreateStoredQueryInput;
};


export type MutationHelloArgs = {
  input: HelloInput;
};


export type MutationUpdateStoredQueryArgs = {
  input: UpdateStoredQueryInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  hello: HelloResponse;
  searchStoredQueries: StoredQueryConnection;
  showStoredQuery: StoredQuery;
  showStoredStoredQueryRows: StoredQueryRowConnection;
};


export type QuerySearchStoredQueriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filterBy?: InputMaybe<QueryFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryShowStoredQueryArgs = {
  databaseId: Scalars['BigInt']['input'];
};


export type QueryShowStoredStoredQueryRowsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFilter = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  columns?: InputMaybe<Array<Scalars['String']['input']>>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  creatorId?: InputMaybe<Scalars['BigInt']['input']>;
  failed?: InputMaybe<Scalars['Boolean']['input']>;
  started?: InputMaybe<Scalars['Boolean']['input']>;
  tableNames?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Source = {
  __typename?: 'Source';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type StoredQuery = {
  __typename?: 'StoredQuery';
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  columns?: Maybe<Array<Scalars['String']['output']>>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['BigInt']['output'];
  databaseId: Scalars['BigInt']['output'];
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  failedReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  query: Scalars['String']['output'];
  serializedConfig?: Maybe<Scalars['JSON']['output']>;
  source: Source;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  tables?: Maybe<Array<Scalars['String']['output']>>;
};

export type StoredQueryConnection = {
  __typename?: 'StoredQueryConnection';
  edges?: Maybe<Array<StoredQueryEdge>>;
  pageInfo: PageInfo;
};

export type StoredQueryEdge = {
  __typename?: 'StoredQueryEdge';
  node?: Maybe<StoredQuery>;
};

export type StoredQueryRow = {
  __typename?: 'StoredQueryRow';
  serializedData: Scalars['JSON']['output'];
};

export type StoredQueryRowConnection = {
  __typename?: 'StoredQueryRowConnection';
  edges?: Maybe<Array<StoredQueryRowEdge>>;
  pageInfo: PageInfo;
};

export type StoredQueryRowEdge = {
  __typename?: 'StoredQueryRowEdge';
  node?: Maybe<StoredQueryRow>;
};

export type Subscription = {
  __typename?: 'Subscription';
  hello: HelloResponse;
};


export type SubscriptionHelloArgs = {
  names: Array<Scalars['String']['input']>;
};

export type UpdateStoredQueryInput = {
  databaseId: Scalars['BigInt']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  expireAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ArchiveStoredQueryInput: ArchiveStoredQueryInput;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateStoredQueryInput: CreateStoredQueryInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  HelloInput: HelloInput;
  HelloResponse: ResolverTypeWrapper<HelloResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  QueryFilter: QueryFilter;
  Source: ResolverTypeWrapper<Source>;
  StoredQuery: ResolverTypeWrapper<StoredQuery>;
  StoredQueryConnection: ResolverTypeWrapper<StoredQueryConnection>;
  StoredQueryEdge: ResolverTypeWrapper<StoredQueryEdge>;
  StoredQueryRow: ResolverTypeWrapper<StoredQueryRow>;
  StoredQueryRowConnection: ResolverTypeWrapper<StoredQueryRowConnection>;
  StoredQueryRowEdge: ResolverTypeWrapper<StoredQueryRowEdge>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateStoredQueryInput: UpdateStoredQueryInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ArchiveStoredQueryInput: ArchiveStoredQueryInput;
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  CreateStoredQueryInput: CreateStoredQueryInput;
  DateTime: Scalars['DateTime']['output'];
  HelloInput: HelloInput;
  HelloResponse: HelloResponse;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  PageInfo: PageInfo;
  Query: {};
  QueryFilter: QueryFilter;
  Source: Source;
  StoredQuery: StoredQuery;
  StoredQueryConnection: StoredQueryConnection;
  StoredQueryEdge: StoredQueryEdge;
  StoredQueryRow: StoredQueryRow;
  StoredQueryRowConnection: StoredQueryRowConnection;
  StoredQueryRowEdge: StoredQueryRowEdge;
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateStoredQueryInput: UpdateStoredQueryInput;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type HelloResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HelloResponse'] = ResolversParentTypes['HelloResponse']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  archiveStoredQuery?: Resolver<ResolversTypes['StoredQuery'], ParentType, ContextType, RequireFields<MutationArchiveStoredQueryArgs, 'input'>>;
  createStoredQuery?: Resolver<ResolversTypes['StoredQuery'], ParentType, ContextType, RequireFields<MutationCreateStoredQueryArgs, 'input'>>;
  hello?: Resolver<ResolversTypes['HelloResponse'], ParentType, ContextType, RequireFields<MutationHelloArgs, 'input'>>;
  updateStoredQuery?: Resolver<ResolversTypes['StoredQuery'], ParentType, ContextType, RequireFields<MutationUpdateStoredQueryArgs, 'input'>>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  hello?: Resolver<ResolversTypes['HelloResponse'], ParentType, ContextType>;
  searchStoredQueries?: Resolver<ResolversTypes['StoredQueryConnection'], ParentType, ContextType, Partial<QuerySearchStoredQueriesArgs>>;
  showStoredQuery?: Resolver<ResolversTypes['StoredQuery'], ParentType, ContextType, RequireFields<QueryShowStoredQueryArgs, 'databaseId'>>;
  showStoredStoredQueryRows?: Resolver<ResolversTypes['StoredQueryRowConnection'], ParentType, ContextType, Partial<QueryShowStoredStoredQueryRowsArgs>>;
}>;

export type SourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Source'] = ResolversParentTypes['Source']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQuery'] = ResolversParentTypes['StoredQuery']> = ResolversObject<{
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  columns?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  creatorId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  databaseId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expireAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  failedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  failedReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serializedConfig?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  source?: Resolver<ResolversTypes['Source'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  tables?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQueryConnection'] = ResolversParentTypes['StoredQueryConnection']> = ResolversObject<{
  edges?: Resolver<Maybe<Array<ResolversTypes['StoredQueryEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQueryEdge'] = ResolversParentTypes['StoredQueryEdge']> = ResolversObject<{
  node?: Resolver<Maybe<ResolversTypes['StoredQuery']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryRowResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQueryRow'] = ResolversParentTypes['StoredQueryRow']> = ResolversObject<{
  serializedData?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryRowConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQueryRowConnection'] = ResolversParentTypes['StoredQueryRowConnection']> = ResolversObject<{
  edges?: Resolver<Maybe<Array<ResolversTypes['StoredQueryRowEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoredQueryRowEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StoredQueryRowEdge'] = ResolversParentTypes['StoredQueryRowEdge']> = ResolversObject<{
  node?: Resolver<Maybe<ResolversTypes['StoredQueryRow']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  hello?: SubscriptionResolver<ResolversTypes['HelloResponse'], "hello", ParentType, ContextType, RequireFields<SubscriptionHelloArgs, 'names'>>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  BigInt?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  HelloResponse?: HelloResponseResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Source?: SourceResolvers<ContextType>;
  StoredQuery?: StoredQueryResolvers<ContextType>;
  StoredQueryConnection?: StoredQueryConnectionResolvers<ContextType>;
  StoredQueryEdge?: StoredQueryEdgeResolvers<ContextType>;
  StoredQueryRow?: StoredQueryRowResolvers<ContextType>;
  StoredQueryRowConnection?: StoredQueryRowConnectionResolvers<ContextType>;
  StoredQueryRowEdge?: StoredQueryRowEdgeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;

