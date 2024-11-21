/**
 * WordPress dependencies
 */
import {
	FormTokenField,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useDebouncedInputValue from '../hooks/useDebouncedInputValue';
const operatorOptions = [ 'IN', 'NOT IN', 'EXISTS', 'NOT EXISTS', 'AND' ];

const updateTaxonomyQuery = ( queries, queryId, item, value ) => {
	return queries.map( ( query ) => {
		if ( query.id === queryId ) {
			return {
				...query,
				[ item ]: value,
			};
		}
		return query;
	} );
};

const SingleTaxonomyControl = ( {
	taxonomy,
	terms = [],
	availableTaxonomies,
	includeChildren,
	setAttributes,
	attributes,
	id,
	operator,
} ) => {
	const [ searchTerm, setSearchTerm ] = useDebouncedInputValue( '', 500 );
	const taxInfo = useSelect( ( select ) =>
		select( coreStore ).getTaxonomy( taxonomy )
	);

	const isHierarchical = taxInfo?.hierarchical ?? false;

	const { records } = useEntityRecords( 'taxonomy', taxonomy, {
		per_page: 10,
		search: searchTerm,
		_fields: 'id,name',
		context: 'view',
	} );

	const suggestions = useMemo( () => {
		return ( records ?? [] ).map( ( term ) => term.name );
	}, [ records ] );

	return (
		<>
			<SelectControl
				key={ id }
				label={ __( 'Taxonomy', 'advanced-query-loop' ) }
				value={ taxonomy }
				options={ [
					{ label: 'Choose taxonomy', value: '' },
					...availableTaxonomies.map( ( { name, slug } ) => {
						return {
							label: name,
							value: slug,
						};
					} ),
				] }
				onChange={ ( newTaxonomy ) => {
					setAttributes( {
						query: {
							...attributes.query,
							tax_query: {
								...attributes.query.tax_query,
								queries: updateTaxonomyQuery(
									attributes.query.tax_query.queries,
									id,
									'taxonomy',
									newTaxonomy
								),
							},
						},
					} );
				} }
			/>
			{ taxonomy.length > 1 && (
				<>
					<FormTokenField
						label={ __( 'Term(s)', 'advanced-query-loop' ) }
						suggestions={ suggestions }
						value={ terms }
						onInputChange={ ( newInput ) => {
							setSearchTerm( newInput );
						} }
						onChange={ ( newTerms ) => {
							setAttributes( {
								query: {
									...attributes.query,
									tax_query: {
										...attributes.query.tax_query,
										queries: updateTaxonomyQuery(
											attributes.query.tax_query.queries,
											id,
											'terms',
											newTerms
										),
									},
								},
							} );
						} }
					/>
					<SelectControl
						label={ __( 'Operator', 'advanced-query-loop' ) }
						value={ operator }
						options={ [
							...operatorOptions.map( ( value ) => {
								return { label: value, value };
							} ),
						] }
						onChange={ ( newOperator ) => {
							setAttributes( {
								query: {
									...attributes.query,
									tax_query: {
										...attributes.query.tax_query,
										queries: updateTaxonomyQuery(
											attributes.query.tax_query.queries,
											id,
											'operator',
											newOperator
										),
									},
								},
							} );
						} }
					/>
					{ isHierarchical && (
						<ToggleControl
							label={ __(
								'Include children?',
								'advanced-query-loop'
							) }
							checked={ includeChildren }
							onChange={ () => {
								setAttributes( {
									query: {
										...attributes.query,
										tax_query: {
											...attributes.query.tax_query,
											queries: updateTaxonomyQuery(
												attributes.query.tax_query
													.queries,
												id,
												'include_children',
												! includeChildren
											),
										},
									},
								} );
							} }
							help={ __(
								'For hierarchical taxonomies only',
								'advanced-query-loop'
							) }
						/>
					) }
				</>
			) }
		</>
	);
};

export default SingleTaxonomyControl;
