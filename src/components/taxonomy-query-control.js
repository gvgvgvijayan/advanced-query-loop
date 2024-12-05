/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import {
	Button,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	PanelBody,
	ToggleControl,
	Panel,
	__experimentalHStack as HStack,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SingleTaxonomyControl from './single-taxonomy-control';

const relationOptions = [ 'AND', 'OR' ];

export const TaxonomyQueryControl = ( { attributes, setAttributes } ) => {
	const {
		query: {
			postType,
			multiple_posts: multiplePosts = [],
			tax_query: { relation = '', queries = [] } = {},
		} = {},
	} = attributes;

	const availableTaxonomies = useSelect( ( select ) =>
		select( coreStore )
			.getTaxonomies()
			?.filter( ( { types } ) =>
				types.some( ( type ) =>
					[ postType, ...multiplePosts ].includes( type )
				)
			)
	);

	const advancedMode = false;

	return (
		<>
			<Dropdown
				popoverProps={ {
					placement: 'left-start',
					offset: 36,
				} }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button
						variant="primary"
						onClick={ onToggle }
						aria-haspopup="true"
						aria-expanded={ isOpen }
						disabled={ availableTaxonomies.length === 0 }
					>
						{ isOpen
							? __(
									'Close Taxonomy Query Builder',
									'advanced-query-loop'
							  )
							: __(
									'Open Taxonomy Query Builder',
									'advanced-query-loop'
							  ) }
					</Button>
				) }
				renderContent={ () => (
					<DropdownContentWrapper
						paddingSize="none"
						style={ { width: '30rem' } }
					>
						<Panel
							header={ __(
								'Taxonomy Query Builder',
								'advanced-query-loop'
							) }
						>
							<PanelBody>
								{ queries.length > 1 && (
									<>
										<ToggleControl
											label={ __(
												'Use an OR relationship',
												'advanced-query-loop'
											) }
											checked={ relation === 'OR' }
											onChange={ () => {
												setAttributes( {
													query: {
														...attributes.query,
														tax_query: {
															...attributes.query
																.tax_query,
															relation:
																attributes.query
																	.tax_query
																	.relation ===
																'OR'
																	? 'AND'
																	: 'OR',
														},
													},
												} );
											} }
											__nextHasNoMarginBottom={ false }
										/>
										<hr />
									</>
								) }

								{ queries.map(
									( {
										id,
										taxonomy,
										terms,
										operator,
										include_children: includeChildren,
									} ) => {
										return (
											<SingleTaxonomyControl
												key={ id }
												taxonomy={ taxonomy }
												operator={ operator }
												terms={ terms }
												id={ id }
												relation={ relation }
												includeChildren={
													includeChildren
												}
												availableTaxonomies={
													availableTaxonomies
												}
												setAttributes={ setAttributes }
												attributes={ attributes }
											/>
										);
									}
								) }

								<HStack>
									<Button
										variant="primary"
										onClick={ () => {
											setAttributes( {
												query: {
													...attributes.query,
													tax_query: {
														relation:
															relation || 'AND',
														queries: [
															...queries,

															{
																id: uuidv4(),
																taxonomy: '',
																terms: [],
																include_children: true,
																operator: 'IN',
															},
														],
													},
												},
											} );
										} }
									>
										{ __(
											'Add new query',
											'advanced-query-loop'
										) }
									</Button>
									{ queries.length > 0 && (
										<Button
											variant="primary"
											isDestructive
											onClick={ () => {
												setAttributes( {
													query: {
														...attributes.query,
														tax_query: [],
													},
												} );
												setAdvancedMode( false );
											} }
										>
											{ __(
												'Reset queries',
												'advanced-query-loop'
											) }
										</Button>
									) }
								</HStack>
							</PanelBody>
						</Panel>
					</DropdownContentWrapper>
				) }
			/>
		</>
	);
};
