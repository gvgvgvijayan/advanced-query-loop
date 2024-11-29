/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import {
	ButtonGroup,
	Button,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	TabPanel,
	PanelBody,
	ToggleControl,
	Panel,
	PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SingleTaxonomyControl from './single-taxonomy-control';
import SimpleTaxonomyControl from './simple-taxonomy-control';

export const TaxonomySelect = ( { attributes, setAttributes } ) => {
	const {
		query: {
			postType,
			tax_query: { relation = '', queries = [] } = {},
		} = {},
	} = attributes;

	const availableTaxonomies = useSelect( ( select ) =>
		select( coreStore )
			.getTaxonomies()
			?.filter( ( { types } ) => types.includes( postType ) )
	);

	const [ toggled, setToggled ] = useState( false );

	return (
		<>
			<Dropdown
				popoverProps={ {
					placement: 'left-start',
					offset: 36,
				} }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<>
						<Button
							variant="primary"
							onClick={ onToggle }
							aria-haspopup="true"
							aria-expanded={ isOpen }
						>
							{ isOpen
								? __(
										'Close Taxonomy query builder',
										'advanced-query-loop'
								  )
								: __(
										'Open Taxonomy query builder',
										'advanced-query-loop'
								  ) }
						</Button>
					</>
				) }
				renderContent={ () => (
					<DropdownContentWrapper
						paddingSize="none"
						style={ { width: '30rem' } }
					>
						<Panel
							header={ __(
								'Taxonomy query builder',
								'advanced-query-loop'
							) }
						>
							<PanelBody>
								{ queries.map(
									( { id, taxonomy, terms, operator } ) => {
										return (
											<SimpleTaxonomyControl
												key={ id }
												taxonomy={ taxonomy }
												operator={ operator }
												terms={ terms }
												id={ id }
												availableTaxonomies={
													availableTaxonomies
												}
												setAttributes={ setAttributes }
												attributes={ attributes }
											/>
										);
									}
								) }

								<ToggleControl
									checked={ toggled }
									label={ __(
										'Enable advanced mode',
										'advanced-query-loop'
									) }
									onChange={ () => setToggled( ! toggled ) }
									__nextHasNoMarginBottom={ false }
								/>
							</PanelBody>
						</Panel>

						<TabPanel
							className="taxonomy-query-builder"
							activeClass="css-ms66sk"
							tabs={ [
								{
									name: 'simple',
									title: 'Simple Mode',
								},
							] }
							children={ ( tab ) => {
								switch ( tab.name ) {
									case 'simple': {
										return (
											<PanelBody>
												{ queries.map(
													( {
														id,
														taxonomy,
														terms,
														operator,
													} ) => {
														return (
															<SimpleTaxonomyControl
																key={ id }
																taxonomy={
																	taxonomy
																}
																operator={
																	operator
																}
																terms={ terms }
																id={ id }
																availableTaxonomies={
																	availableTaxonomies
																}
																setAttributes={
																	setAttributes
																}
																attributes={
																	attributes
																}
															/>
														);
													}
												) }

												<ButtonGroup>
													<Button
														variant="primary"
														onClick={ () => {
															setAttributes( {
																query: {
																	...attributes.query,
																	tax_query: {
																		relation:
																			relation ||
																			'AND',
																		queries:
																			[
																				...queries,

																				{
																					id: uuidv4(),
																					taxonomy:
																						'',
																					terms: [],
																					include_children: true,
																					operator:
																						'IN',
																				},
																			],
																	},
																},
															} );
														} }
													>
														Add new taxonomy query
													</Button>

													<Button
														variant="primary"
														onClick={ () =>
															setAttributes( {
																query: {
																	...attributes.query,
																	tax_query:
																		[],
																},
															} )
														}
													>
														Reset
													</Button>
												</ButtonGroup>
											</PanelBody>
										);
									}
									case 'advanced': {
										return null;
										return (
											<PanelBody>
												{ queries.map(
													( {
														id,
														taxonomy,
														terms,
														include_children:
															includeChildren,
														operator,
													} ) => {
														return (
															<SingleTaxonomyControl
																key={ id }
																id={ id }
																taxonomy={
																	taxonomy
																}
																terms={ terms }
																includeChildren={
																	includeChildren
																}
																availableTaxonomies={
																	availableTaxonomies
																}
																operator={
																	operator
																}
																setAttributes={
																	setAttributes
																}
																attributes={
																	attributes
																}
															/>
														);
													}
												) }
												<ButtonGroup>
													<Button
														size="small"
														variant="primary"
														isDestructive
														onClick={ () =>
															setAttributes( {
																query: {
																	...attributes.query,
																	tax_query:
																		[],
																},
															} )
														}
													>
														Reset
													</Button>
													<Button
														variant="primary"
														size="small"
														onClick={ () => {
															setAttributes( {
																query: {
																	...attributes.query,
																	tax_query: {
																		relation,
																		queries:
																			[
																				...queries,
																				{
																					taxonomy:
																						'',
																					terms: [],
																					include_children: true,
																					operator:
																						'IN',
																					id: uuidv4(),
																				},
																			],
																	},
																},
															} );
														} }
													>
														Add new taxonomy query
													</Button>
												</ButtonGroup>
											</PanelBody>
										);
									}
								}
							} }
						/>
					</DropdownContentWrapper>
				) }
			/>
		</>
	);
};
